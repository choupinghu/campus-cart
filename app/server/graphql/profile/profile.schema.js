export const profileTypeDefs = `#graphql
  type Profile {
    id: ID!
    name: String!
    email: String!
    image: String
    bio: String
    phone: String
    location: String
    createdAt: String!
    listingCount: Int!
  }

  input UpdateProfileInput {
    name: String
    bio: String
    phone: String
    location: String
    image: String
  }

  extend type Query {
    me: Profile!
  }

  extend type Mutation {
    updateProfile(input: UpdateProfileInput!): Profile!
  }
`;
