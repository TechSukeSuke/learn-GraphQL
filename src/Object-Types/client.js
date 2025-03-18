const numSides = 6;
const query = /* GraphQL */ `
  query getDie($numSides: Int!) {
    getDie(numSides: $numSides) {
      rollOnce
      roll(numRolls: 3)
    }
  }
`;
 
fetch('http://localhost:4000/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  body: JSON.stringify({
    query,
    variables: { numSides },
  }),
})
  .then((r) => r.json())
  .then((data) => console.log('data returned:', data));
