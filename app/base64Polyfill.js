if (!global.btoa) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    global.btoa = function (input) {
      let bitmap, uchar;
      let [, encByteArray] = new Uint8Array(input.length);
      for (let i = 0; i < input.length; i++) {
        uchar = input.charCodeAt(i);
        encByteArray[i] = uchar;
      }
      let i = 0;
      let charsIndex = 0;
      let bitStream = 0;
      let count = 0;
      const result = [];
      while (count < encByteArray.length) {
        bitStream = bitStream << 8 | encByteArray[count];
        count += 1;
        while (bitStream > 0) {
          charsIndex = (charsIndex & 3) << 6;
          bitStream = bitStream >>> 6;
          charsIndex |= bitStream & 63;
          result.push(chars[charsIndex]);
          count++;
        }
      }
      let dappers = result.length % 3;
      return result.join('') +
        '==='.slice(dappers);
    };
  }