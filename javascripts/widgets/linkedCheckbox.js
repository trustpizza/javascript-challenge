function linkedCheckbox(widget) {
    
    // Select all checkbox items
    const linkedCheckboxes = widget.querySelectorAll('[kjs-role=checkbox]');
    // setup function
        // Setup function needs to set the current checkbox item 
        // Set a variable to equal the current checkbox item's children (and their children, etc. etc. until all elements are selected)
        // Set a variable equal to a widget's state (checked, unchecked, intermediary)

    function setup() {
        const activeCheckboxLI = widget.querySelector('.active[kjs-role=checkbox]');
        const activeChildren = findChildren(activeCheckboxLI);
        const checkbox = firstCheckbox(activeCheckboxLI);

        // This one takes the active checbkox and sets all the children to be checked
        
        for (let i = 0; i < activeChildren.length; i++) {
            activeChildren[i].checked = checkbox.checked;
        }

        /* 
            Function that searches for siblings to see if all are checked

            Have a stop gap of a the most parent item

            If search the parent element of the target element.
            If all the elements are = to one another, then element.checked = parent.checked
            else, nothing
        
        */
   
        
    }

    function findChildren(checkbox) {
        const allDescendants = [];

        let childNodes = checkbox.parentElement.childNodes;

        for (let i = 0; i < childNodes.length; i++) {
            const element = childNodes.length;
            if (childNodes[i].nodeType == 1) {
                recurseToFindChildren(childNodes[i], allDescendants);
            }          
        }

        return allDescendants.slice(1); // This slice removes the element itself from the array
    };

    function findCheckedChildren(checkbox) {
        const checkedDescendants = [];
        const allDescendants = findChildren(checkbox);
        
        for (let i = 0; i < allDescendants.length; i++) {
            const element = allDescendants[i];
            if (element.checked) { 
                checkedDescendants.push(element)
            }
        }
        return checkedDescendants;
    }

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

        for (let i = 0; i < children.length; i++) {
            children[i].addEventListener("click", () => {
                let checkedCount = findCheckedChildren(checkbox).length;

                checkbox.checked = checkedCount > 0;
                checkbox.indeterminate = (checkedCount > 0 && checkedCount < children.length);
                // console.log(checkbox, checkedCount > 0, checkedCount < children.length, checkedCount);
            })
        }

        setup();
        /* 
            What does this for loop do?

            Take all the child elements and createa  for loop that loops that many times
            If any of the children are clicked it will:
                1. Set the 
        */
        

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

    let actions = [];

    linkedCheckboxes.forEach((checkbox) => {
        actions.push({
            element: checkbox,
            event: 'click',
            handler: handleCheckboxClick
        })
    })
    
    return { setup, actions }
}

module.exports = linkedCheckbox;
