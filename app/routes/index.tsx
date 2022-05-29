import { animated, useSpring } from '@react-spring/web';
import { useEffect, useState } from 'react';
import type { LinkProps } from '@remix-run/react';
import { NavLink } from '@remix-run/react';
import cn from 'classnames';

function Link({ to, ...props }: LinkProps) {
  const STYLE =
    'hover:bg-gray-900 hover:text-gray-100 dark:hover:bg-gray-100 ' +
    'dark:hover:text-gray-900';
  return (
    <li>
      {typeof to === 'string' && to.startsWith('mailto') ? (
        <a className={STYLE} href={to} {...props}>
          {props.children}
        </a>
      ) : (
        <NavLink
          className={({ isActive }) =>
            cn(STYLE, {
              'cursor-not-allowed bg-gray-900 text-gray-100 dark:bg-gray-100 dark:text-gray-900':
                isActive,
            })
          }
          to={to}
          {...props}
        />
      )}
    </li>
  );
}

export default function Index() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  const [awards, setAwards] = useState([
    '#1 USA Champion (1994)',
    '#1 USA Champion (1995)',
    '#2 USA Champion (1996)',
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
      <nav className='fixed bottom-4 left-4 z-20'>
        <ul>
          <Link to='/gear'>gear</Link>
          <Link to='/training'>training</Link>
          <Link
            to='mailto:braumon@creightonwrestling.com'
            target='_blank'
            rel='noopener noreferrer'
          >
            contact
          </Link>
          <Link to='/'>about</Link>
          <li>
            {now.toLocaleString(undefined, {
              timeZone: 'America/Los_Angeles',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false,
            })}
          </li>
        </ul>
      </nav>
      <section className='relative flex min-h-screen items-center justify-center'>
        <video
          className='absolute inset-0 z-0 max-h-full min-h-full min-w-full max-w-full object-cover'
          autoPlay
          muted
          loop
        >
          <source src='/assets/wrestling.mp4' type='video/mp4' />
        </video>
        <div className='absolute inset-0 z-10 bg-black/80' />
        <article className='z-20 max-w-xl'>
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
          <h1 className='font-sans text-8xl font-black leading-[0.85] tracking-tight'>
            CREIGHTON TRAINED
          </h1>
          <p className='mx-2.5 mt-12'>
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
    </main>
  );
}
