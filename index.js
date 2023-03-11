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
      "height": 1025,
      "name": "Hanging_Pocket_Pullover_Black_Hoodie_Mockup.jpg",
      "path": "/Hanging_Pocket_Pullover_Black_Hoodie_Mockup.jpg",
      "size": 266333,
      "url": "/Hanging_Pocket_Pullover_Black_Hoodie_Mockup.jpg",
      "width": 771
    }
  },
  {
    "id": "3",
    "name": "T-shirt",
    "price": 40,
    "image": {
      "height": 894,
      "name": "Woman_T-shirt_Mockup.jpg",
      "path": "/Woman_T-shirt_Mockup.jpg",
      "size": 156864,
      "url": "/Woman_T-shirt_Mockup.jpg",
      "width": 687
    }
  },
  {
    "id": "4",
    "name": "Cap",
    "price": 30,
    "image": {
      "height": 330,
      "name": "Snapback_Cap_Mockup.jpg",
      "path": "/Snapback_Cap_Mockup.jpg",
      "size": 94434,
      "url": "/Snapback_Cap_Mockup.jpg",
      "width": 559
    }
  },
  {
    "id": "6",
    "name": "Tote Bag",
    "price": 30,
    "image": {
      "height": 528,
      "name": "Tote_Bag_Mockup.jpg",
      "path": "/Tote_Bag_Mockup.jpg",
      "size": 255791,
      "url": "/Tote_Bag_Mockup.jpg",
      "width": 928
    }
  },
  {
    "id": "7",
    "name": "Slippers",
    "price": 25,
    "image": {
      "height": 224,
      "name": "Slip-On_Shoe_Mockup.jpg",
      "path": "/Slip-On_Shoe_Mockup.jpg",
      "size": 111371,
      "url": "/Slip-On_Shoe_Mockup.jpg",
      "width": 742
    }
  },
  {
    "id": "8",
    "name": "Flip Flops",
    "price": 15,
    "image": {
      "height": 559,
      "name": "Flip_Flops_Left.jpg",
      "path": "/Flip_Flops_Left.jpg",
      "size": 79771,
      "url": "/Flip_Flops_Left.jpg",
      "width": 235
    }
  },
  {
    "id": "9",
    "name": "Coffee Beans",
    "price": 10,
    "image": {
      "height": 893,
      "name": "Stand_Up_Pouch_Bag_Mockup.jpg",
      "path": "/Stand_Up_Pouch_Bag_Mockup.jpg",
      "size": 476727,
      "url": "/Stand_Up_Pouch_Bag_Mockup.jpg",
      "width": 590
    }
  },
  {
    "id": "10",
    "name": "Notebook",
    "price": 5,
    "image": {
      "height": 683,
      "name": "Kraft_Notebook.jpg",
      "path": "/Kraft_Notebook.jpg",
      "size": 388111,
      "url": "/Kraft_Notebook.jpg",
      "width": 809
    }
  },
  {
    "id": "11",
    "name": "Soap",
    "price": 8,
    "image": {
      "height": 232,
      "name": "Soap_dyihGkE.jpg",
      "path": "/Soap_dyihGkE.jpg",
      "size": 76363,
      "url": "/Soap_dyihGkE.jpg",
      "width": 700
    }
  },
  {
    "id": "12",
    "name": "Grinder",
    "price": 25,
    "image": {
      "height": 1024,
      "name": "White_Grinder_CaGGkhu.jpg",
      "path": "/White_Grinder_CaGGkhu.jpg",
      "size": 147103,
      "url": "/White_Grinder_CaGGkhu.jpg",
      "width": 1361
    }
  },
  {
    "id": "13",
    "name": "Glass Pump",
    "price": 15,
    "image": {
      "height": 1024,
      "name": "Amber_Glass_Pump_Bottle_VhkzU7T.jpg",
      "path": "/Amber_Glass_Pump_Bottle_VhkzU7T.jpg",
      "size": 225578,
      "url": "/Amber_Glass_Pump_Bottle_VhkzU7T.jpg",
      "width": 521
    }
  },
  {
    "id": "14",
    "name": "Microphone",
    "price": 250,
    "image": {
      "height": 1024,
      "name": "Microphone_Without_Sponge_and_Cable_Q6KOyXd.jpg",
      "path": "/Microphone_Without_Sponge_and_Cable_Q6KOyXd.jpg",
      "size": 256319,
      "url": "/Microphone_Without_Sponge_and_Cable_Q6KOyXd.jpg",
      "width": 490
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