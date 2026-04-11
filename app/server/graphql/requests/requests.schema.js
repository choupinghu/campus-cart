export const requestsTypeDefs = `#graphql
  type Requester {
    id: ID!
    name: String!
    image: String
  }

  type Request {
    id: ID!
    title: String!
    description: String
    budget: Float!
    condition: String
    location: String
    status: String!
    user: Requester!
    category: Category!
    createdAt: String!
    updatedAt: String!
  }

  input CreateRequestInput {
    title: String!
    description: String
    budget: Float!
    condition: String
    category: String!
    location: String
  }

  input UpdateRequestInput {
    title: String
    description: String
    budget: Float
    condition: String
    category: String
    location: String
    status: String
  }

  type RequestLocationCount {
    location: String!
    requestCount: Int!
  }

  extend type Query {
    requests(userId: String): [Request!]!
    request(id: ID!): Request
    requestLocationCounts: [RequestLocationCount!]!
  }

  extend type Mutation {
    createRequest(input: CreateRequestInput!): Request!
    updateRequest(id: ID!, input: UpdateRequestInput!): Request!
    deleteRequest(id: ID!): DeleteResult!
  }
`;
