'use strict';
const $=id=>document.getElementById(id);
let bytes=null, decoded=null, filename='converted.csv', revision=0;
function status(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function clearPreview(){ $('preview').querySelector('tbody').replaceChildren(); }
function render(){
  decoded=null; $('download').disabled=true; clearPreview();
  if(!bytes){ $('badge').textContent='等待选择文件'; return; }
  try {
    decoded=CsvLocal.decode(bytes,$('encoding').value);
    const rows=CsvLocal.preview(decoded.text,$('separator').value==='tab'?'\t':$('separator').value);
    for(const row of rows){const tr=document.createElement('tr'); for(const cell of row.slice(0,12)){const td=document.createElement('td');td.textContent=cell.slice(0,200)+(cell.length>200?'…':'');tr.append(td);} $('preview').querySelector('tbody').append(tr);}
    $('badge').textContent=decoded.encoding.toUpperCase();
    status(filename+' · '+bytes.length.toLocaleString()+' 字节 · 请检查预览中的中文是否正确。'+(decoded.text.includes('\uFFFD')?'文件中已含替换字符 �，本工具无法恢复其原文。':''));
    $('download').disabled=false;
  } catch(error){ $('badge').textContent='需要检查编码'; status(error.message,true); }
}
$('file').addEventListener('change',async()=>{
  const current=++revision; bytes=null;render();const file=$('file').files[0];if(!file){status('请选择文件。');return;}
  if(file.size>5*1024*1024){status('文件超过 5 MiB，请先拆分后处理。',true);return;}
  if(!/\.(csv|tsv|txt)$/i.test(file.name)){status('仅支持 CSV、TSV 和 TXT 文本文件，不支持 XLSX / XLS。',true);return;}
  status('正在本地读取文件…');
  try {const buffer=await file.arrayBuffer();if(current!==revision)return;bytes=new Uint8Array(buffer);filename=file.name;$('separator').value=/\.tsv$/i.test(filename)?'tab':',';render();}
  catch {if(current===revision)status('无法读取文件，请重新选择。',true);}
});
$('sample').addEventListener('click',()=>{revision++;$('file').value='';bytes=new TextEncoder().encode('姓名,城市,备注\r\n林晓,杭州,"包含逗号,仍在同一格"\r\n王宁,北京,"第一行\n第二行"\r\n');filename='中文示例.csv';$('encoding').value='auto';$('separator').value=',';render();});
for(const id of ['encoding','separator'])$(id).addEventListener('change',render);
$('download').addEventListener('click',()=>{
  if(!decoded)return;
  const blob=new Blob([CsvLocal.encode(decoded.text,$('output').value==='bom')],{type:'text/csv;charset=utf-8'});
  const url=URL.createObjectURL(blob), a=document.createElement('a');a.href=url;a.download=filename.replace(/\.[^.]+$/,'')+($('output').value==='bom'?'-utf8-bom':'-utf8')+(/\.tsv$/i.test(filename)?'.tsv':'.csv');document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);status('已发起下载。请在 Excel 中检查结果；原文件未被覆盖。');
});
