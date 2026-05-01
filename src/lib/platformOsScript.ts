/**
 * Runs before React hydrates. Adds `os-mac` or `os-windows` on `<html>` so CSS can
 * diverge (e.g. navbar) without affecting the other platform.
 */
export const platformOsScript = `
(function(){
  var h=document.documentElement;
  try{
    var u=navigator.userAgent||'';
    var p=navigator.platform||'';
    if(/Win/.test(u)||/Windows/i.test(u)){ h.classList.add('os-windows'); return; }
    if(/Mac|iPhone|iPad|iPod/i.test(p)||/Mac OS X/.test(u)){ h.classList.add('os-mac'); return; }
  }catch(e){}
  h.classList.add('os-windows');
})();
`.trim();
