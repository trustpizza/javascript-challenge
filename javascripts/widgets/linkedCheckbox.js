function linkedCheckbox(widget) {
    
    const linkedCheckboxes = widget.querySelectorAll('[kjs-role=checkbox]');

    function setup() {
        const activeCheckboxLI = widget.querySelector('.active[kjs-role=checkbox]');
        const activeChildren = findChildren(activeCheckboxLI);
        const checkbox = firstCheckbox(activeCheckboxLI);
        
        for (let i = 0; i < activeChildren.length; i++) {
            activeChildren[i].checked = checkbox.checked; // Selects or deselets all child elements
        }
    }

    function findChildren(checkboxLI) {
        const allDescendants = [];

        let childNodes = checkboxLI.childNodes;

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
        const allDescendants = findChildren(checkbox.parentElement);
        
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
                // This loop searches all the children and does 2 things.  If there are no more checked children, the parent element is unchecked.  If there are some checked elements but not all, it is set to indeterminate
            })
        }

        setup();
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
