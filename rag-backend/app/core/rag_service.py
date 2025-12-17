# from typing import List, Dict
# from app.core.vector_storage import qdrant_storage
# from langchain_core.prompts import ChatPromptTemplate
# from langchain_core.output_parsers import StrOutputParser
# from app.core.config import settings
# import dashscope
# from langchain_community.llms import DashScope
# import os


# class RAGService:
#     def __init__(self):
#         # Set the DashScope API key
#         dashscope.api_key = settings.qwen_api_key

#         # Initialize the LLM
#         self.llm = DashScope(
#             model_name=settings.model_name,
#             dashscope_api_key=settings.qwen_api_key,
#             temperature=0.3
#         )

#         # Define the prompt template for the RAG system
#         self.rag_prompt = ChatPromptTemplate.from_messages([
#             ("system", """
#             You are an AI assistant for the Physical AI & Humanoid Robotics textbook.
#             Use the following context from the textbook to answer the user's question.
#             If the context doesn't contain the information needed to answer the question,
#             say "I don't have information about this in the textbook, but I can try to provide a general answer if you'd like."

#             Context: {context}
#             """),
#             ("human", "{question}")
#         ])

#         # Create the chain
#         self.rag_chain = self.rag_prompt | self.llm | StrOutputParser()

#     def retrieve_documents(self, query: str, top_k: int = 5) -> List[Dict]:
#         """
#         Retrieve relevant documents based on the query
#         """
#         return qdrant_storage.search_documents(query, top_k)

#     def generate_response(self, query: str, top_k: int = 5) -> str:
#         """
#         Generate a response using retrieved documents and the LLM
#         """
#         # Retrieve relevant documents
#         retrieved_docs = self.retrieve_documents(query, top_k)

#         # Format the context from retrieved documents
#         context = "\n\n".join([doc["content"] for doc in retrieved_docs])

#         # Generate the response using the RAG chain
#         response = self.rag_chain.invoke({
#             "context": context,
#             "question": query
#         })

#         return {
#             "response": response,
#             "sources": [doc["metadata"] for doc in retrieved_docs]
#         }


# # Global instance of RAGService
# rag_service = RAGService()










from typing import List, Dict
from app.core.vector_storage import qdrant_storage
from app.core.config import settings
from app.utils.text_utils import truncate_to_lines, extract_topic_summary, create_concise_summary
import os


class RAGService:
    def __init__(self):
        # Initialize with mock response or local processing
        # Since API key is not properly configured, we'll create a fallback response
        pass

    def retrieve_documents(self, query: str, top_k: int = 5) -> List[Dict]:
        """
        Retrieve relevant documents based on the query
        """
        # First, try to find documents that are most relevant to the query
        initial_results = qdrant_storage.search_documents(query, top_k * 2)  # Retrieve more for better selection

        # If it's a "what is" question, prioritize documents that contain definition patterns
        if any(keyword in query.lower() for keyword in ["what is", "what are", "define", "definition", "meaning of"]):
            # Re-rank results by how likely they contain definitions
            initial_results.sort(key=lambda x: self._definition_relevance_score(x, query), reverse=True)

        # Return top_k results
        return initial_results[:top_k]

    def _definition_relevance_score(self, document: Dict, query: str) -> float:
        """
        Calculate a score based on how likely a document contains a definition for the query.
        """
        content = document["content"].lower()

        # Check if the content contains definition markers
        definition_indicators = [
            "is a", "is the", "refers to", "are", "means", "defined as",
            "describes", "represents", "stands for", "characterized by",
            "a type of", "a form of", "an example of"
        ]

        # Calculate score based on definition indicators
        definition_score = sum(1 for indicator in definition_indicators if indicator in content)

        # Boost score if the query terms appear early in the content
        query_words = query.lower().split()
        content_words = content.split()[:20]  # First 20 words
        early_match_bonus = sum(1 for word in query_words if word in content_words)

        # Total score
        return definition_score + (early_match_bonus * 0.5)

    def generate_response(self, query: str, top_k: int = 5) -> Dict:
        """
        Generate a response using retrieved documents
        """
        # Retrieve relevant documents
        retrieved_docs = self.retrieve_documents(query, top_k)

        if not retrieved_docs:
            # If no documents are found, return a default response
            response = "I don't have information about this in the textbook."
            sources = []
        else:
            # For "what is" questions, we need to specifically look for definitions
            is_what_question = any(word in query.lower() for word in ["what is", "what are", "define", "definition of", "mean by"])

            if is_what_question:
                # First, look for chunks that contain definitions
                definition_chunks = self._find_definition_chunks(retrieved_docs, query)

                if definition_chunks:
                    # Use the definition-focused chunks
                    combined_content = definition_chunks[0]["content"]
                    valid_sources = [definition_chunks[0]["metadata"]]
                else:
                    # If no definition found, use regular processing
                    combined_content, valid_sources = self._select_content_chunks(retrieved_docs, query)
            else:
                # For non "what is" questions, use regular processing
                combined_content, valid_sources = self._select_content_chunks(retrieved_docs, query)

            if combined_content:
                # Create a concise summary that directly addresses the user's query
                summary = create_concise_summary(combined_content, query)

                # Clean the summary to remove formatting artifacts
                cleaned_summary = self._clean_text(summary)

                # Ensure the response is 1-2 sentences max
                sentences = [s.strip() for s in cleaned_summary.split('.') if s.strip() and len(s.strip()) > 10]
                if len(sentences) > 0:
                    if len(sentences) > 2:
                        # Take only first 2 sentences
                        final_summary = '. '.join(sentences[:2]) + '.'
                    else:
                        # Join sentences and ensure it ends with a period
                        final_summary = '. '.join(sentences)
                        if not final_summary.endswith('.'):
                            final_summary += '.'
                else:
                    # If no proper sentences found, return the cleaned summary but limit to ~200 chars
                    final_summary = cleaned_summary[:200]
                    if len(cleaned_summary) > 200:
                        final_summary += "..."
                    if not final_summary.endswith('.'):
                        final_summary += '.'

                # Ensure response is truly concise (1-2 sentences max)
                concise_summary = self._ensure_concise_response(final_summary)

                # Format response with source information
                response = self._format_response_with_source(concise_summary, valid_sources)
                sources = valid_sources[:3]  # Limit to top 3 sources for cleaner response
            else:
                # If no valid content was found, return appropriate message
                response = "I don't have information about this in the textbook."
                sources = []

        return {
            "response": response,
            "sources": sources
        }

    def _find_definition_chunks(self, retrieved_docs, query):
        """
        Specifically look for chunks that contain definitions related to the query.
        """
        # Look for content that contains definition patterns and is highly relevant to the query
        definition_chunks = []
        query_keywords = set(query.lower().split())

        for doc in retrieved_docs:
            content = doc["content"].strip()

            if len(content.strip()) < 20:
                continue

            content_lower = content.lower()

            # Check for definition patterns
            has_definition_indicators = any(indicator in content_lower for indicator in [
                "is a", "is the", "refers to", "are", "means", "defined as",
                "describes", "represents", "stands for", "characterized by",
                "a type of", "a form of", "an example of", "consists of"
            ])

            # Check relevance to query
            keyword_matches = sum(1 for keyword in query_keywords if keyword in content_lower and len(keyword) > 1)

            # Prioritize chunks that have both definition indicators and keyword matches
            if has_definition_indicators and keyword_matches > 0:
                # Calculate a relevance score
                relevance_score = keyword_matches * 2 + (1 if has_definition_indicators else 0)

                definition_chunks.append({
                    "content": content,
                    "metadata": doc["metadata"],
                    "relevance_score": relevance_score
                })

        # Sort by relevance score
        definition_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        return definition_chunks

    def _select_content_chunks(self, retrieved_docs, query):
        """
        Select content chunks using the original logic (refactored)
        """
        query_keywords = set(query.lower().split())

        # Score and rank documents based on relevance to the query and completeness
        scored_chunks = []
        for doc in retrieved_docs:
            content = doc["content"].strip()

            # Skip if it's just a header
            if content.startswith('#') or content.startswith('*') or content.startswith('-'):
                continue

            # Skip if too short to be meaningful
            if len(content.strip()) < 20 or len(content.split()) < 3:
                continue

            # Score based on how many query keywords appear in the content
            content_lower = content.lower()
            keyword_matches = sum(1 for keyword in query_keywords if keyword.lower() in content_lower and len(keyword) > 2)

            # Check if the content starts mid-sentence vs complete thought
            # Look for indicators of complete content vs fragments
            starts_with_complete_indicator = (
                content[0].isupper() if content and content[0].isalpha() else False
            )

            # Check if it starts with common sentence starters that suggest completeness
            content_lower = content.lower()
            starts_with_intro = any(content_lower.startswith(word) for word in ['the ', 'this ', 'physical ', 'humanoid ', 'ai ', 'robot', 'what ', 'introduction ', 'overview '])

            # Factor in completeness as part of the score
            completeness_factor = 0
            if starts_with_complete_indicator or starts_with_intro:
                completeness_factor = 1.0  # Higher bonus for complete content
            elif len(content) > 50 and content[0].islower():
                completeness_factor = -0.5  # Small penalty for long content starting mid-sentence

            # Additional: Check if this content seems to answer the type of question asked
            # If query is asking "what is", prioritize content that provides definitions
            is_what_question = any(word in query.lower() for word in ["what is", "what are", "what"])
            has_definition_indicators = any(indicator in content_lower for indicator in [
                "is a", "refers to", "are", "means", "defined as", "describes", "represents", "stands for"
            ])

            definition_bonus = 0.7 if (is_what_question and has_definition_indicators) else 0

            # Additional refinement: if content starts mid-sentence but continues with a definition/answer,
            # we should look for complete thoughts that directly address the query
            # Check if the content is likely to be a continuation (starts with common continuation words)
            mid_sentence_continuation = any(content_lower.startswith(word) for word in [
                'and ', 'but ', 'or ', 'so ', 'with ', 'without ', 'where ', 'when ', 'while ', 'although ',
                'though ', 'however ', 'then ', 'also ', 'especially ', 'particularly ', 'including ', 'especially ', 'furthermore '
            ])

            # Penalize content that clearly starts mid-sentence and continues that way
            mid_sentence_penalty = -0.8 if mid_sentence_continuation else 0

            adjusted_score = keyword_matches + completeness_factor + definition_bonus + mid_sentence_penalty

            scored_chunks.append((adjusted_score, content, doc["metadata"], keyword_matches))

        # Sort by score descending
        scored_chunks.sort(key=lambda x: x[0], reverse=True)

        # Take the top relevant chunks (with good scores) for summary
        combined_content = ""
        valid_sources = []

        if scored_chunks and scored_chunks[0][0] > 0:  # If we have relevant content
            # Take top 2 chunks that have good relevance and completeness
            top_chunks = [chunk for chunk in scored_chunks if chunk[0] > 0][:2]

            for score, content, metadata, original_score in top_chunks:
                combined_content += content + " "
                valid_sources.append(metadata)
        else:
            # If no highly relevant content, just take the first few documents
            top_chunks = scored_chunks[:2]
            for score, content, metadata, original_score in top_chunks:
                combined_content += content + " "
                valid_sources.append(metadata)

        return combined_content, valid_sources

    def _clean_text(self, text: str) -> str:
        """
        Clean text by removing common formatting artifacts and creating readable sentences.
        """
        import re

        # Remove markdown headers
        text = re.sub(r'\#{1,6}\s*', '', text)

        # Remove markdown bold/italic formatting
        text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)  # Bold
        text = re.sub(r'\*(.*?)\*', r'\1', text)      # Italic

        # Remove extra whitespaces while preserving sentence structure
        text = re.sub(r'\s+', ' ', text)

        # Remove list markers and their formatting but preserve the content
        # Remove dash and asterisk list indicators at the beginning of phrases
        text = re.sub(r'(?<!\w)[\*\-\+]\s+', '', text)

        # Fix common phrase separators, but preserve hyphens within words (like "human-like")
        # First, fix broken hyphenated words by temporarily preserving them
        text = re.sub(r'(\w)\s*-\s*(\w)', r'\1-\2', text)  # Restore hyphenated words like human-like

        # Ensure proper spacing after punctuation
        text = re.sub(r'\.([A-Z])', r'. \1', text)
        text = re.sub(r',([A-Z])', r', \1', text)

        # Fix common phrase concatenations that might look like "wordword"
        # But be careful not to split legitimate compound words
        text = text.replace('##', '. ')  # Headers that weren't caught earlier
        text = text.replace('#', '')

        # Clean up any remaining multiple spaces
        text = ' '.join(text.split())

        # Handle edge cases where the text starts with special characters
        text = text.lstrip(' -.*/_')

        return text.strip()

    def _ensure_concise_response(self, response: str) -> str:
        """
        Ensure the response is truly concise by limiting to 1-2 sentences and ensuring they are complete.
        """
        import re

        # Split by sentence endings but preserve the periods
        sentence_endings = re.split(r'(\.|\!|\?)', response)

        # Reconstruct sentences by pairing text with their ending punctuation
        sentences = []
        for i in range(0, len(sentence_endings)-1, 2):
            if i+1 < len(sentence_endings):
                sentence = (sentence_endings[i] + sentence_endings[i+1]).strip()
                if sentence and len(sentence) > 10:  # Only include meaningful sentences
                    sentences.append(sentence)

        # If we have more than 2 sentences or if we have fragments, limit to 1-2 meaningful sentences
        if len(sentences) > 2:
            # Take the first 2 sentences that are most complete/meaningful
            concise_response = ' '.join(sentences[:2])
        elif len(sentences) == 0:
            # If no proper sentences found, take first 200 characters and ensure it ends with a period
            concise_response = response[:200]
            if len(response) > 200:
                concise_response += "..."
            if not concise_response.endswith(('.', '!', '?')):
                concise_response += '.'
        elif len(sentences) == 1:
            concise_response = sentences[0]
        else:
            concise_response = ' '.join(sentences)

        # Additional cleaning to make sure it's properly formatted
        concise_response = ' '.join(concise_response.split())  # Normalize whitespace

        # If the response is still too long (>300 chars), truncate further
        if len(concise_response) > 300:
            # Find the last sentence ending within 300 chars
            truncated = concise_response[:300]
            last_sentence_end = max(
                truncated.rfind('.'),
                truncated.rfind('!'),
                truncated.rfind('?')
            )
            if last_sentence_end > 100:  # Make sure we keep a reasonable amount of content
                truncated = truncated[:last_sentence_end+1]
            else:
                truncated = truncated + "..."
            concise_response = truncated

        return concise_response.strip()

    def _format_response_with_source(self, response_text: str, sources: list) -> str:
        """
        Format the response text with source information.

        Args:
            response_text: The main response content
            sources: List of source metadata

        Returns:
            Formatted response string including source information
        """
        if not sources:
            return response_text

        # Get the most relevant source (first one)
        source = sources[0]

        # Try to extract source information - depending on how metadata is stored
        source_info = "Textbook"
        if "source" in source:
            # Common field for document source
            source_info = source["source"]
        elif "filename" in source:
            source_info = source["filename"]
        elif "title" in source:
            source_info = source["title"]
        elif "url" in source:
            # Extract meaningful name from URL
            import os
            source_info = os.path.basename(source["url"])
            if source_info == "" or "." not in source_info:
                # If it's just a path, get the parent directory or a meaningful part
                source_info = os.path.basename(os.path.dirname(source["url"] or "Textbook"))

        # Create the formatted response with source
        formatted_response = f"{response_text} [Source: {source_info}]"

        return formatted_response


# Global instance of RAGService
rag_service = RAGService()
