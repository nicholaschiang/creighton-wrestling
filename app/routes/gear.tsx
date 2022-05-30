import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import type { Stripe } from 'stripe';
import invariant from 'tiny-invariant';

import { stripe } from '~/stripe.server';

export const loader: LoaderFunction = async () => {
  const products = await stripe.products.list({
    limit: 100,
    expand: ['data.default_price'],
  });
  return json(products.data);
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const priceId = formData.get('price');
  invariant(typeof priceId === 'string', 'expected formData.priceId');
  const url = new URL(request.url);
  const session = await stripe.checkout.sessions.create({
    success_url: `${url.protocol}//${url.host}/gear`,
    cancel_url: `${url.protocol}//${url.host}/gear`,
    line_items: [{ price: priceId, quantity: 1 }],
    mode: 'payment',
  });
  return redirect(session.url as string);
};

export default function Gear() {
  const products = useLoaderData<Stripe.Product[]>();
  return (
    <main>
      <header className='border-b py-8'>
        <h1 className='text-center font-sans text-8xl font-black leading-none tracking-tight'>
          CREIGHTON TRAINED
        </h1>
      </header>
      <ul className='mx-auto flex flex-wrap p-10'>
        {products.map((product) => (
          <li className='m-4 min-w-[200px] flex-1'>
            <Form method='post'>
              <input
                type='hidden'
                name='price'
                value={(product.default_price as Stripe.Price).id}
              />
              <button type='submit' className='group text-left'>
                <img
                  className='w-full bg-gray-100 dark:bg-gray-900/50'
                  src={product.images[0]}
                  alt={product.name}
                />
                <h2 className='mt-2.5 leading-none'>
                  <span className='group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black'>
                    {product.name}
                  </span>
                </h2>
                <p className='mt-1.5 leading-none text-gray-500'>
                  {product.description}
                </p>
                <p className='mt-1.5 leading-none'>
                  {(product.default_price as Stripe.Price).unit_amount / 100}{' '}
                  {(
                    product.default_price as Stripe.Price
                  ).currency.toUpperCase()}
                </p>
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </main>
  );
}
