function linkedCheckbox(widget) {
    
    // Select all checkbox items
    const linkedCheckboxes = widget.querySelectorAll('[kjs-role=checkbox]');
    // setup function
        // Setup function needs to set the current checkbox item 
        // Set a variable to equal the current checkbox item's children (and their children, etc. etc. until all elements are selected)
        // Set a variable equal to a widget's state (checked, unchecked, intermediary)

    function setup() {
        const activeCheckbox = widget.querySelector('.active[kjs-role=checkbox]');
        let activeChildren = findChildren(activeCheckbox);

        linkedCheckboxes.forEach((checkbox) => {
            let children = findChildren(checkbox);
        });
    }

    function findChildren(checkbox) {
        const allDescendants = [];

        let childNodes = checkbox.childNodes;

        for (let i = 0; i < childNodes.length; i++) {
            const element = childNodes.length;
            if (childNodes[i].nodeType == 1) {
                recurseToFindChildren(childNodes[i], allDescendants);
            }          
        }

        return allDescendants.slice(1); // This slice removes the element itself from the array
    };

    function recurseToFindChildren(el, descendants) {
        if (el.nodeName == "INPUT") {
            descendants.push(el); // This only returns the actual checkboxes available, not just every element
        };

        let children = el.children;

        for (let i = 0; i < children.length; i++) {
            if (children[i].nodeType == 1) {
                recurseToFindChildren(children[i], descendants);
            }
        }
    }

    function handleCheckboxClick(e) {
        linkedCheckboxes.forEach((checkbox) => { checkbox.classList.remove('active');})
        const el = e.target.parentElement;
        el.classList.add('active');
        
        const checkbox = firstCheckbox(el);
        const children = findChildren(el);
        


        setup();
        //const children = findChildren(el.parentElement); // This requires to find the parent element because the findChildren fucntion actually looks at the list item element (it requires an element you can nest other elements in and INPUTS are not able to nest elements)
        //console.log(el, children)
    }

    function firstCheckbox(el) {
        let out;
        el.childNodes.forEach((node) => {
            if (node.nodeName == "INPUT") {
                out = node;
            }
        })
        return out;
    }
    // What does the setup function need to do? It needs
    /* 
        The setup function needs to create the logic for a checkbox. 
        The logic for a checkbox is:
            1. Each box must have a list of child elements (this list can be null) 
                !!! Important consideration: What kind of data model do I want for checkbox children? I can either have an array or a node list (technically a hash but that's not helpful)
                !!! Leaning towards a linked list
            2. Each box must have a parent element (this can also be null)
            3. Each box must have a state (checked, unchecked, intermediary)

        There must also be a function that handles state changes
        checkboxClickHandler () {
            This function needs to do the following:
            1. Search the node list of child elements 
        }
    */
    let actions = [

    ];

    linkedCheckboxes.forEach((checkbox) => {
        actions.push({
            element: checkbox,
            event: 'click',
            handler: handleCheckboxClick
        })
    })
    console.log(actions);
    
    return { setup, actions }
}

module.exports = linkedCheckbox;
