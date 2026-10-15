'use strict';
module.exports = async function* (events) {
  for await (const event of events) {
    if (['test:pass','test:fail'].includes(event.type)) {
      const {name,skip,todo,file,details} = event.data;
      yield `${JSON.stringify({type:event.type,name,skip:!!skip,todo:!!todo,file,suite:details?.type === 'suite'})}\n`;
    }
  }
};
