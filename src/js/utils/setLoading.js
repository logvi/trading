window.Loader = document.getElementById('loader');
window.LoaderDescription = document.getElementById('loader-description');

export default function(text) {
    if (!text) {
        Loader.classList.add('inactive');
        return;
    }
    Loader.classList.remove('inactive');
    LoaderDescription.innerText = text;
}