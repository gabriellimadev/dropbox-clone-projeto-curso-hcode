class DropBoxController{

    constructor(){

        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');

        this.initEvents();
    }

    initEvents(){

        this.btnSendFileEl.addEventListener('click', event =>{

            this.inputFilesEl.click();

        })

        this.inputFilesEl.addEventListener('change', event =>{

            this.uploadTask(event.target.files);

            this.snackModalEl.style.display = 'block'
        })

    }

    uploadTask(files){
    
        let promises = [];

        [...files].forEach(file =>{
            
            promises.push(new Promise((res, rej)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event =>{

                    try {
                        res(JSON.parse(ajax.responseText));
                    } catch(e){
                        rej(e);
                    }
                }

                ajax.onerror = event=>{

                    rej(event)
                };

                let formData = new FormData();

                formData.append('input-file', file)

                ajax.send(formData)
            }))
        })

        return Promise.all(promises)
    }

} 