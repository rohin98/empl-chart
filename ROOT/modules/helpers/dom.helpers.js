
export function createElement(tagName, attributes, childNodes) {
    const element = document.createElement(tagName);

    // Set attributes if provided
    if (attributes.constructor === Object) {
        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });
    }

    // Append child nodes if provided
    if (childNodes !== null && childNodes !== undefined) {
        if (childNodes.constructor === Array) {
            childNodes.forEach(node => {
                element.appendChild(node);
            });
        } else if (typeof childNodes === 'object') {
            element.appendChild(childNodes);
        } else {
            element.innerHTML = childNodes;
        }
    }

    return element;
}

export function removeAllChildNodes(node) {
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}

export function searchObjects(searchText, searchProperty, objects) {
    // const escapedText = searchText.replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
    
    const regex = new RegExp(`(${searchText})`, 'gi');

    const filteredList = objects.filter((obj) => {
        return (obj[searchProperty].search(regex) >= 0);
    });

    return { filteredList, regex };
}