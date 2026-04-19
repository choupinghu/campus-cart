export const paymentTypeDefs = `#graphql
  type PaymentIntentResult {
    clientSecret: String!
    orderId: ID!
    amount: Float!
    currency: String!
  }

  extend type Mutation {
    createPaymentIntent(listingId: ID!): PaymentIntentResult!
  }
`;
