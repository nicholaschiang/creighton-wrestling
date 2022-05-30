import {
  Links,
  LiveReload,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node';
import { useEffect, useState } from 'react';
import type { LinkProps } from '@remix-run/react';
import cn from 'classnames';
import { json } from '@remix-run/node';

import { getUser } from './session.server';
import tailwindStylesheetUrl from './styles/tailwind.css';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: tailwindStylesheetUrl },
];

export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'Remix Notes',
  viewport: 'width=device-width,initial-scale=1',
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) =>
  json<LoaderData>({
    user: await getUser(request),
  });

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

export default function App() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const intervalId = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);
  return (
    <html
      lang='en'
      className='h-full w-full bg-white text-gray-900 selection:bg-gray-200 selection:text-black dark:bg-black dark:text-gray-100 dark:selection:bg-gray-700 dark:selection:text-gray-100'
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body className='h-full w-full'>
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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
