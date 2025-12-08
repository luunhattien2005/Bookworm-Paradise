
function List() {
    const fruits = [{id: 1, name:'Apple', calories:95}, 
                    {id: 2, name:'Banana', calories:105}, 
                    {id: 3, name:'Cherry', calories:50}, 
                    {id: 4, name:'Pineapple', calories:452}];

    // fruits.sort((a, b) => a.calories - b.calories);
    fruits.sort((a, b) => a.name.localeCompare(b.name));

    const listItems = fruits.map(fruit => <li key={fruit.id}>{fruit.name} - {fruit.calories} calories</li>);

    const lowCalorieFruits = fruits.filter(fruit => fruit.calories < 100);    

    return (<ul>{listItems}</ul>);
}

export default List;