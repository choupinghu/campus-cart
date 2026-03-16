export const listingsTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
  }

  type Seller {
    id: ID!
    name: String!
    image: String
  }

  type Listing {
    id: ID!
    title: String!
    description: String
    price: Float!
    condition: String
    location: String
    imageUrl: String
    status: String!
    seller: Seller!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  type DeleteResult {
    message: String!
    id: ID!
  }

  input CreateListingInput {
    title: String!
    description: String
    price: Float!
    condition: String
    category: String!
    location: String
    imageUrl: String
  }

  input UpdateListingInput {
    title: String
    description: String
    price: Float
    condition: String
    category: String
    location: String
    imageUrl: String
    status: String
  }

  type Query {
    listings(sellerId: String): [Listing!]!
    listing(id: ID!): Listing
  }

  type Mutation {
    createListing(input: CreateListingInput!): Listing!
    updateListing(id: ID!, input: UpdateListingInput!): Listing!
    deleteListing(id: ID!): DeleteResult!
  }
`;
