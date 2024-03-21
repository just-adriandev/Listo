import Stripe  from 'stripe';

 export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
  typescript: true,

});

export const getStripeSession = async ({priceId, domainUrl, customerId} : {priceId: string, domainUrl: string, customerId: string })  => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{price: priceId, quantity: 1}],
        mode: 'subscription',
        billing_address_collection:'auto',
        success_url: `https://listonow.vercel.app/payment/success`,
        cancel_url: `$https://listonow.vercel.app/payment/cancelled`,
        customer: customerId,
        customer_update: {
        address:'auto',
        name:'auto',
        }
    });
    
    return session.url as string;
};