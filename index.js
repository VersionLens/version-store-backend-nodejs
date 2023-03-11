var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type Query {
    products: [Product!]!
    product(pk: ID!): Product!
    basket: Basket!
  }

  type Mutation {
    addToBasket(productId: Int!): Basket!
    removeFromBasket(itemId: Int!): Basket!
  }

  type Basket {
    id: ID!
    items: [BasketItem!]!
  }

  type BasketItem {
    id: ID!
    product: Product!
  }

  type DjangoImageType {
    name: String!
    path: String!
    size: Int!
    url: String!
    width: Int!
    height: Int!
  }

  type Product {
    id: ID!
    name: String!
    price: Int!
    image: DjangoImageType!
  }
`);

// In-memory database
const products = [
    {
        id: 1,
        name: 'Product 1',
        price: 10,
        image: {
            name: 'Product 1 Image',
            path: './product1/',
            size: 100,
            url: 'https://placekitten.com/300/300',
            width: 300,
            height: 300
        }
    },
    {
        id: 2,
        name: 'Product 2',
        price: 20,
        image: {
            name: 'Product 2 Image',
            path: './product2/',
            size: 200,
            url: 'https://placekitten.com/300/300',
            width: 300,
            height: 300
        }
    }
];

let basket = {
    id: 1,
    items: []
};

// The root provides a resolver function for each API endpoint
var root = {
    products: () => {
        return products;
    },
    product: ({ pk }) => {
        return products.find(product => product.id == pk);
    },
    basket: () => {
        return basket;
    },
    addToBasket: ({ productId }) => {
        const product = products.find(product => product.id == productId);
        const newBasketItem = {
            id: basket.items.length + 1,
            product
        };
        basket.items.push(newBasketItem);
        return basket;
    },
    removeFromBasket: ({ itemId }) => {
        basket.items = basket.items.filter(item => item.id !== itemId);
        return basket;
    }
};

var app = express();
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(4000, '0.0.0.0');
console.log('Running a GraphQL API server at http://0.0.0.0:4000/graphql');