const getFormData = () => {
    let f = document.querySelector('form')
    let fd = new FormData(f);
    let data = Object.fromEntries(fd);

    return data;
}

const shareFlag = false;

export { getFormData, shareFlag };