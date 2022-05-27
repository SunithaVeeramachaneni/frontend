export const generateCopyNumber = (currentNumbers) => {
    let newIndex = 0;
 const sorter = (a, b) => {
  if (a < b) return -1;  // any negative number works
  if (a > b) return 1;   // any positive number works
  return 0; // equal values MUST yield zero
 }
 currentNumbers.sort(sorter)
;
 let isInOrder;
  if(currentNumbers.length)
  isInOrder = currentNumbers.every((number, index) =>{
      newIndex += 1;
      return number === index+ 1
      })
      
   else
      newIndex = 1;
      
 if(isInOrder) newIndex +=1;

 return newIndex;
  
};

export const escapeRegex = (string) => {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }
  
export  const generateCopyRegex = (reportName) =>  {
    const escapedName = escapeRegex(reportName)
    return new RegExp(`^${escapedName} Copy\\((\\d+)\\)`)
  }

