import { animated, useSpring } from '@react-spring/web';
import { useState } from 'react';

export default function Index() {
  const [awards, setAwards] = useState([
    '#1 NCAA Champion (1994)',
    '#1 NCAA Champion (1995)',
    '#2 NCAA Champion (1996)',
  ]);
  const [awardEls, setAwardEls] = useState<HTMLSpanElement[]>([]);
  const [awardIdx, setAwardIdx] = useState(1);
  const style = useSpring({
    config: { tension: 280, friction: 120 },
    from: { x: 0 },
    to: {
      x:
        -1 * awardEls.slice(0, awardIdx).reduce((a, b) => a + b.clientWidth, 0),
    },
    onStart() {
      setAwards((prev) => [...prev, awards[awardIdx - 1]]);
    },
    onRest({ finished }) {
      if (finished)
        setAwardIdx((prev) => (awards.length > prev ? prev + 1 : 0));
    },
  });
  return (
    <main>
      <section className='relative flex min-h-screen items-center justify-center'>
        <video
          className='clipped absolute inset-0 z-0 max-h-full min-h-full min-w-full max-w-full object-cover'
          autoPlay
          muted
          loop
        >
          <source src='/assets/wrestling.mp4' type='video/mp4' />
        </video>
        <div className='clipped absolute inset-0 z-10 bg-black/60' />
        <article className='relative z-20 max-w-xl'>
          <div className='absolute -left-4 top-0 min-h-screen border-l' />
          <p className='relative mx-2.5 -mb-0.5 h-8 overflow-hidden whitespace-nowrap'>
            <animated.span style={style} className='absolute left-0 top-0'>
              {awards.map((name, idx) => (
                <span
                  className='inline-block'
                  ref={(el) =>
                    setAwardEls((prev) => {
                      if (el) prev[idx] = el;
                      return prev;
                    })
                  }
                  key={`award-${idx}-${name}`}
                >
                  {name}
                  <span className='mx-2.5'>·</span>
                </span>
              ))}
            </animated.span>
          </p>
          <h1 className='mb-12 font-sans text-8xl font-black leading-[0.85] tracking-tight'>
            CREIGHTON TRAINED
          </h1>
          <p className='mx-2.5 mt-5'>
            My approach to coaching combines a unique mix of practical knowledge
            and scientific research.
          </p>
          <p className='mx-2.5 mt-5'>
            All the best performers in life have coaches that help them reach
            higher levels.
          </p>
          <p className='mx-2.5 mt-5'>
            My aim is to empower you to{' '}
            <strong className='underline'>reach your highest level</strong>.
          </p>
        </article>
      </section>
      <section className='relative flex items-center justify-center'>
        <article className='relative max-w-xl'>
          <img
            className='absolute -left-12 top-1/2 w-80 -translate-x-full -translate-y-1/2'
            src='/assets/creighton.png'
            alt=''
          />
          <div className='absolute -left-4 top-0 min-h-screen border-l' />
          <h2 className='mx-2.5 font-sans text-4xl font-black tracking-tight'>
            I am Coach Creighton
          </h2>
          <p className='mx-2.5 mt-5'>
            As a wrestler, Creighton was a State Champion and two-time NCAA
            Champion.
          </p>
          <p className='mx-2.5 mt-5'>
            Coach Creighton is a certified secondary teacher with a Masters
            Degree in Kinesiology. In 2018, Braumon earned his Gold
            Certification, USA Wrestling’s highest level.
          </p>
          <p className='mx-2.5 mt-5'>
            Coach Creighton has mastered the pedagogy of wrestling through 20
            years of teaching experience at every level.
          </p>
        </article>
      </section>
    </main>
  );
}
