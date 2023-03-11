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
    "id": "2",
    "name": "Sweatshirt",
    "price": 50,
    "image": {
      "url": "/Hanging_Pocket_Pullover_Black_Hoodie_Mockup.jpg"
    }
  },
  {
    "id": "3",
    "name": "T-shirt",
    "price": 40,
    "image": {
      "url": "/Woman_T-shirt_Mockup.jpg"
    }
  },
  {
    "id": "4",
    "name": "Cap",
    "price": 30,
    "image": {
      "url": "/Snapback_Cap_Mockup.jpg"
    }
  },
  {
    "id": "6",
    "name": "Tote Bag",
    "price": 30,
    "image": {
      "url": "/Tote_Bag_Mockup.jpg"
    }
  },
  {
    "id": "7",
    "name": "Slippers",
    "price": 25,
    "image": {
      "url": "/Slip-On_Shoe_Mockup.jpg"
    }
  },
  {
    "id": "8",
    "name": "Flip Flops",
    "price": 15,
    "image": {
      "url": "/Flip_Flops_Left.jpg"
    }
  },
  {
    "id": "9",
    "name": "Coffee Beans",
    "price": 10,
    "image": {
      "url": "/Stand_Up_Pouch_Bag_Mockup.jpg"
    }
  },
  {
    "id": "10",
    "name": "Notebook",
    "price": 5,
    "image": {
      "url": "/Kraft_Notebook.jpg"
    }
  },
  {
    "id": "11",
    "name": "Soap",
    "price": 8,
    "image": {
      "url": "/Soap_dyihGkE.jpg"
    }
  },
  {
    "id": "12",
    "name": "Grinder",
    "price": 25,
    "image": {
      "url": "/White_Grinder_CaGGkhu.jpg"
    }
  },
  {
    "id": "13",
    "name": "Glass Pump",
    "price": 15,
    "image": {
      "url": "/Amber_Glass_Pump_Bottle_VhkzU7T.jpg"
    }
  },
  {
    "id": "14",
    "name": "Microphone",
    "price": 250,
    "image": {
      "url": "/Microphone_Without_Sponge_and_Cable_Q6KOyXd.jpg"
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
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
app.listen(4000, '0.0.0.0');
console.log('Running a GraphQL API server at http://0.0.0.0:4000/graphql');