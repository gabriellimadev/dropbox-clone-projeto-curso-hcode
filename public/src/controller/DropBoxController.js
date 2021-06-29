class DropBoxController{

    constructor(){

        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.inputFilesEl = document.querySelector('#files');
        this.snackModalEl = document.querySelector('#react-snackbar-root');
        this.progressBarEl = this.snackModalEl.querySelector('.mc-progress-bar-fg');
        this.filenameEl = this.snackModalEl.querySelector('.filename');
        this.timeleftEl = this.snackModalEl.querySelector('.timeleft')


        this.initEvents();
    }

    initEvents(){

        this.btnSendFileEl.addEventListener('click', event =>{

            this.inputFilesEl.click();

        })

        this.inputFilesEl.addEventListener('change', event =>{
            
            this.uploadTask(event.target.files);

            this.modalShow();

            this.inputFilesEl.value = '';
        })
        
    }
    
    modalShow(show = 'true'){

        this.snackModalEl.style.display = (show) ? 'block' : 'none'
    }

    uploadTask(files){
    
        let promises = [];

        [...files].forEach(file =>{
            
            promises.push(new Promise((res, rej)=>{

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event =>{

                    this.modalShow(false)

                    try {
                        res(JSON.parse(ajax.responseText));
                    } catch(e){
                        rej(e);
                    }
                }

                ajax.onerror = event=>{

                    this.modalShow(false);
                    rej(event);
                };

                ajax.upload.onprogress = event =>{

                    this.uploadProgress(event, file);
                }

                let formData = new FormData();

                formData.append('input-file', file);

                this.startUploadTime = Date.now();

                ajax.send(formData)
            }))
        })

        return Promise.all(promises)
    }

    uploadProgress(event, file){

        let timespent = Date.now() - this.startUploadTime;
        let loaded = event.loaded;
        let total = event.total;
        let percent = parseInt((loaded / total) * 100);
        
        let timeleft = ((100 - percent) * timespent) / percent

        this.progressBarEl.style.width = `${percent}%`;

        this.filenameEl.innerHTML = file.name;
        this.timeleftEl.innerHTML = this.formatTimeToHuman(timeleft);

    }

    formatTimeToHuman(duration){

        let seconds = parseInt((duration / 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`;
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`;
        }

        if (seconds > 0) {
            return `${seconds} segundos`;
        }

        return ''




    }
} 