import fs from 'fs';

class Helper {
  // save a data to a file
  static saveDataToFile(filePath, dataFile, values) {
    const result = dataFile.unshift(values);

    if (result !== -1) {
      fs.writeFileSync(filePath, JSON.stringify(dataFile), 'utf8');
    }

    return values;
  }

  static saveMessage(filePath, dataFile) {
    fs.writeFileSync(filePath, JSON.stringify(dataFile), 'utf8');
  }

  // generate unique id
  static generateId(dataArray, index) {
    return dataArray.length > 0 ? dataArray[index].id + 1 : 0;
  }

  // find a user by email
  static findUserByEmail(objArr, userEmail) {
    return objArr.find(element => element.email === userEmail);
  }

  // find a message by status
  static findMessage(objArr, status) {
    return objArr.filter(el => el.status === status);
  }

  // find a sent messages by sender
  static findSentMessagesById(objArr, status, id) {
    return objArr.filter(el => el.status === status && el.senderId === id);
  }

  // find a Recieved messages by Reciever
  static findRecievedMessagesById(objArr, status, id) {
    return objArr.filter(el => el.status === status && el.recieverId === id);
  }

  // find a message by id
  static findMessageById(objArr, messageId, id) {
    const sent = objArr.filter(el => el.id === messageId && el.senderId === id);
    const recieved = objArr.filter(el => el.id === messageId && el.recieverId === id);

    const messages = [...sent, ...recieved];

    return messages;
  }

  // find message by sender id
  static findMessageBySenderId(objArr, messageId, id) {
    return objArr.filter(el => el.id === messageId && el.senderId === id);
  }

  // filter a message by id
  static filterMessage(objArr, messageId) {
    return objArr.filter(el => el.id !== messageId);
  }
}

export default Helper;
