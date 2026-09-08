(function(root) {
  'use strict';
  function decode(bytes, encoding) {
    const data = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
    if (!data.length) throw new Error('文件为空，请选择包含内容的 CSV。');
    let chosen = encoding;
    if (chosen === 'auto') {
      if (data[0] === 255 && data[1] === 254) chosen = 'utf-16le';
      else if (data[0] === 254 && data[1] === 255) chosen = 'utf-16be';
      else {
        try { new TextDecoder('utf-8', {fatal:true}).decode(data); chosen = 'utf-8'; }
        catch { throw new Error('不是有效的 UTF-8。请手动选择 GB18030 / GBK 或其他原始编码，再检查预览。'); }
      }
    }
    let text;
    try { text = new TextDecoder(chosen, {fatal:true}).decode(data); }
    catch { throw new Error('所选编码无法完整读取文件。请更换原始编码；下载已禁用，以免丢失文字。'); }
    if (text.includes('\0')) throw new Error('检测到空字符：请检查是否选错编码，或误选了 XLSX 等二进制文件。');
    return {text, encoding:chosen};
  }
  // A bounded preview only. The export never parses or reserializes CSV.
  function preview(text, separator, limit=8) {
    const rows=[]; let row=[], value='', quoted=false, ended=false;
    for (let i=0;i<text.length;i++) {
      const ch=text[i]; ended=false;
      if(ch==='"') {
        if(quoted && text[i+1]==='"') { value+='"'; i++; }
        else if(quoted || value==='') quoted=!quoted;
        else value+=ch;
      } else if(ch===separator && !quoted) { row.push(value); value=''; }
      else if((ch==='\r'||ch==='\n') && !quoted) {
        row.push(value); rows.push(row); row=[]; value=''; ended=true;
        if(ch==='\r' && text[i+1]==='\n') i++;
        if(rows.length>=limit) return rows;
      } else value+=ch;
    }
    if(!ended && (value!=='' || row.length || text.length)) { row.push(value); rows.push(row); }
    return rows;
  }
  function encode(text, bom=true) {
    return new TextEncoder().encode((bom?'\uFEFF':'')+text);
  }
  const api={decode,preview,encode};
  if(typeof module!=='undefined' && module.exports) module.exports=api;
  else root.CsvLocal=api;
})(typeof globalThis!=='undefined'?globalThis:this);
