def truncate_to_max_tokens(text: str, max_tokens: int = 50) -> str:
    """
    Truncate text to approximately max_tokens (words) to ensure concise responses.
    """
    words = text.split()
    if len(words) <= max_tokens:
        return text

    truncated_text = ' '.join(words[:max_tokens])

    # Add ellipsis to indicate truncation
    if len(text) > len(truncated_text):
        truncated_text += "..."

    return truncated_text


def extract_topic_summary(text: str, max_length: int = 100) -> str:
    """
    Extract a short topic summary from the beginning of the text.
    """
    # Take the first sentence or up to max_length characters
    if '.' in text:
        first_sentence = text.split('.')[0] + '.'
        if len(first_sentence) <= max_length:
            return first_sentence
        else:
            return first_sentence[:max_length] + "..."
    else:
        # If no sentence ending found, return first max_length characters
        if len(text) <= max_length:
            return text
        return text[:max_length] + "..."


def truncate_to_lines(text: str, num_lines: int = 2) -> str:
    """
    Truncate text to first num_lines non-empty lines.
    """
    lines = text.split('\n')
    non_empty_lines = []

    for line in lines:
        if line.strip():  # Only count non-empty lines
            non_empty_lines.append(line.strip())
            if len(non_empty_lines) >= num_lines:
                break

    return '. '.join(non_empty_lines)


def create_concise_summary(text: str, query: str = "") -> str:
    """
    Create a concise 1-2 sentence summary from the text content that directly addresses the query.

    Args:
        text: The source text to summarize
        query: Optional query that can be used to guide the summarization

    Returns:
        A 1-2 sentence summary that directly answers the query
    """
    # Clean the text by removing extra whitespace and newlines
    cleaned_text = ' '.join(text.split())

    # Split into sentences (preserving the period)
    sentence_parts = cleaned_text.split('.')
    sentences = []
    for i, part in enumerate(sentence_parts[:-1]):  # Exclude last empty part if text ends with '.'
        if part.strip():
            sentences.append(part.strip() + '.')

    # Add the last part if it doesn't end with a period
    if sentence_parts and sentence_parts[-1].strip():
        sentences.append(sentence_parts[-1].strip())

    # If query is provided, try to find sentences more relevant to the query
    if query:
        query_words = set(query.lower().split())

        # Score sentences based on keyword matches from the query
        scored_sentences = []
        for sentence in sentences:
            score = sum(1 for word in query_words if word.lower() in sentence.lower())
            scored_sentences.append((score, sentence))

        # Sort by score in descending order
        scored_sentences.sort(key=lambda x: x[0], reverse=True)

        # Pick top sentences that have some relevance to the query
        top_sentences = [s[1] for s in scored_sentences if s[0] > 0 and len(s[1]) > 5][:2]  # Filter out very short sentences

        if top_sentences:
            summary = ' '.join(top_sentences)

            # Limit to 2 sentences max and a reasonable length (around 200 chars)
            if len(summary) > 200 or len(top_sentences) > 2:
                parts = summary.split('. ')
                if len(parts) > 1:
                    # Keep first 2 sentences
                    summary = '. '.join(parts[:2]) + '.'
                else:
                    summary = summary[:200] + "..."

            if not summary.endswith('.'):
                summary += '.'

            return summary

    # If no query or no relevant sentences found, return the first 1-2 sentences
    if sentences:
        relevant_sentences = [s for s in sentences if len(s) > 5]  # Filter out very short sentences
        if len(relevant_sentences) >= 2:
            summary = ' '.join(relevant_sentences[:2])
        elif len(relevant_sentences) == 1:
            summary = relevant_sentences[0]
        else:
            summary = ' '.join(sentences[:2])  # Fallback to original if no long sentences found

        # Ensure the summary isn't too long
        if len(summary) > 200:
            summary = summary[:200] + "..."
        elif not summary.endswith('.'):
            summary += '.'

        return summary

    # Fallback: return the first 200 characters
    return text[:200] + "..." if len(text) > 200 else text