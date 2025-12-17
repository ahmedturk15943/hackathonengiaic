// import {themes as prismThemes} from 'prism-react-renderer';
// import type {Config} from '@docusaurus/types';
// import type * as Preset from '@docusaurus/preset-classic';

// const config: Config = {
//   title: 'Physical AI & Humanoid Robotics',
//   tagline: 'Hackathon Textbook by Panaversity',
//   favicon: 'img/favicon.ico',

//   future: {
//     v4: true,
//   },

//   url: 'https://your-vercel-or-github-pages-url.com',
//   baseUrl: '/',

//   organizationName: 'ahmedturk15943',
//   projectName: 'hackathonengiaic',

//   onBrokenLinks: 'ignore',
//   onBrokenMarkdownLinks: 'warn',

//   i18n: {
//     defaultLocale: 'en',
//     locales: ['en'],
//   },

//   presets: [
//     [
//       'classic',
//       {
//         docs: {
//           sidebarPath: './sidebars.ts',
//           editUrl: 'https://github.com/ahmedturk15943/hackathonengiaic/tree/main/',
//         },
//         blog: {
//           showReadingTime: true,
//           editUrl: 'https://github.com/ahmedturk15943/hackathonengiaic/tree/main/',
//         },
//         theme: {
//           customCss: './src/css/custom.css',
//         },
//       } satisfies Preset.Options,
//     ],
//   ],

//   plugins: [
//     () => ({
//       name: 'chatbot-injector',
//       injectHtmlTags() {
//         return {
//           postBodyTags: [
//             `<div id="chatbot-injector"></div>`,
//           ],
//         };
//       },
//     }),
//   ],
//   themeConfig: {
//     image: 'img/social-card-physical-ai.jpg',
//     colorMode: {
//       respectPrefersColorScheme: true,
//     },
//     navbar: {
//       title: 'Hackathon Robotics Book',
//       logo: {
//         alt: 'Physical AI & Humanoid Robotics Logo',
//         src: 'img/robotics-logo.svg',
//       },
//       items: [
//         {
//           href: 'https://github.com/ahmedturk15943/hackathonengiaic',
//           label: 'GitHub',
//           position: 'right',
//         },
//       ],
//     },
//     footer: {
//       style: 'dark',
//       links: [
//         {
//           title: 'Docs',
//           items: [
//             { label: 'Tutorial', to: '/docs/intro' },
//           ],
//         },
//         {
//           title: 'Community',
//           items: [
//             { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
//             { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
//             { label: 'X', href: 'https://x.com/docusaurus' },
//           ],
//         },
//         {
//           title: 'More',
//           items: [
//             { label: 'Blog', to: '/blog' },
//             { label: 'GitHub', href: 'https://github.com/ahmedturk15943/hackathonengiaic' },
//           ],
//         },
//       ],
//       copyright: `Copyright © 2025 Ahmed Raza Turk.`,
//     },
//     prism: {
//       theme: prismThemes.github,
//       darkTheme: prismThemes.dracula,
//     },
//   } satisfies Preset.ThemeConfig,
// };

// export default config;

















import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Physical AI & Humanoid Robotics',
  tagline: 'Hackathon Textbook by Panaversity',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://your-vercel-or-github-pages-url.com',
  baseUrl: '/',

  organizationName: 'ahmedturk15943',
  projectName: 'hackathonengiaic',

  onBrokenLinks: 'ignore',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/ahmedturk15943/hackathonengiaic/tree/main/',
        },
        blog: {
          showReadingTime: true,
          editUrl: 'https://github.com/ahmedturk15943/hackathonengiaic/tree/main/',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    './src/plugins/homepage-chatbot-plugin',
  ],
  themeConfig: {
    image: 'img/social-card-physical-ai.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Hackathon Robotics Book',
      logo: {
        alt: 'Physical AI & Humanoid Robotics Logo',
        src: 'img/robotics-logo.svg',
      },
      items: [
        {
          href: 'https://github.com/ahmedturk15943/hackathonengiaic',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            { label: 'Tutorial', to: '/docs/intro' },
          ],
        },
        {
          title: 'Community',
          items: [
            { label: 'Stack Overflow', href: 'https://stackoverflow.com/questions/tagged/docusaurus' },
            { label: 'Discord', href: 'https://discordapp.com/invite/docusaurus' },
            { label: 'X', href: 'https://x.com/docusaurus' },
          ],
        },
        {
          title: 'More',
          items: [
            { label: 'Blog', to: '/blog' },
            { label: 'GitHub', href: 'https://github.com/ahmedturk15943/hackathonengiaic' },
          ],
        },
      ],
      copyright: `Copyright © 2025 Ahmed Raza Turk.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

