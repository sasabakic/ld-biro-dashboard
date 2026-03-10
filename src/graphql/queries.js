import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query clients {
    clients {
      id
      name
    }
  }
`;
