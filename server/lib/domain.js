const freemail = require('../lib/freemail.json')
const disposable = require('../lib/disposable.json')
const blacklist = require('../lib/blacklist.json')

const domain_search = {
    isForbiddenDomain: function (email_address) {
        return new Promise((resolve, reject) => {
            let domain = extractDomain(email_address)
            
            var isForbidden = isIncludedDomainList(blacklist, domain) ||
                isIncludedDomainList(freemail, domain) ||
                isIncludedDomainList(disposable, domain)

            console.log('isForbidden? ' + isForbidden)

            resolve(isForbidden)
        })
        
    },
    getDomain: function(email_address) {
        return extractDomain(email_address)
    }

}

function isIncludedDomainList(domain_list, domain) {
    return binarySearch(domain_list, domain) !== -1
}

function extractDomain(email_address, excludeTopLevel)
{
    if (email_address && email_address.indexOf('@') !== -1) {
        let index1 = email_address.indexOf('@') + 1
        let sub1 = email_address.substring(index1)

        if (excludeTopLevel)
        {
            if (sub1 && sub1.indexOf('.')) {
                let index2 = sub1.indexOf('.')
    
                return sub1.substring(0, index2)
            } 
            else {
                return ''
            }
        }
        
        return sub1
    }
    else {
        return ''
    }
}

//Copyright 2009 Nicholas C. Zakas. All rights reserved.
//MIT-Licensed, see source file
//https://humanwhocodes.com/blog/2009/09/01/computer-science-in-javascript-binary-search/
function binarySearch(items, value) {

    var startIndex  = 0,
        stopIndex   = items.length - 1,
        middle      = Math.floor((stopIndex + startIndex)/2);

    while(items[middle] != value && startIndex < stopIndex){

        //adjust search area
        if (value < items[middle]){
            stopIndex = middle - 1;
        } else if (value > items[middle]){
            startIndex = middle + 1;
        }

        //recalculate middle
        middle = Math.floor((stopIndex + startIndex)/2);
    }

    //make sure it's the right value
    return (items[middle] != value) ? -1 : middle;
}

module.exports = domain_search 