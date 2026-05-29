import { gql } from "@apollo/client";

export const GET_CLIENTS = gql`
  query clients {
    clients {
      id
      name
      pib
      mbr
      servicesPrice
      status
      dedicatedEmployee {
        id
        name
      }
    }
  }
`;

export const UPDATE_CLIENT = gql`
  mutation UpdateClient($input: UpdateClientInput!) {
    UpdateClient(input: $input) {
      client {
        id
        name
        pib
        mbr
        servicesPrice
        status
        dedicatedEmployee {
          id
          name
        }
      }
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($input: DeleteClientInput!) {
    DeleteClient(input: $input) {
      client {
        id
        name
      }
    }
  }
`;

export const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    CreateClient(input: $input) {
      client {
        id
        name
        pib
        mbr
        status
      }
    }
  }
`;
