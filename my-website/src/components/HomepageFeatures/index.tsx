import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: 'Fundamentals First',
    Svg: require('@site/static/img/physical-ai-concept.svg').default,
    description: (
      <>
        Master foundational concepts in Physical AI and robotics with step-by-step learning modules designed for progressive skill development.
      </>
    ),
  },
  {
    title: 'Hands-On Projects',
    Svg: require('@site/static/img/humanoid-robotics.svg').default,
    description: (
      <>
        Apply theoretical knowledge through practical projects building and programming humanoid robots with simulated and real environments.
      </>
    ),
  },
  {
    title: 'Cutting-Edge Techniques',
    Svg: require('@site/static/img/ai-brain-processing.svg').default,
    description: (
      <>
        Explore advanced algorithms and techniques used in state-of-the-art Physical AI and humanoid robotics implementations.
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
