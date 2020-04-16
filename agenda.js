    //1 etapa - identificar os elementos da tela

(function(){
    console.log("Starting APP...");
    var endpoint = "http://localhost:7000/contacts";

    //UI (User Interface)
    var ui = {
        fields:document.querySelectorAll("input"),
        buttonAdd:document.querySelector(".btnAdd"),
        tableContacts:document.querySelector(".table-contacts"),
    };

    //Actions - Ações - O que o sistema vai fazer?
    var validateFields = function(e){
        e.preventDefault();//previne comportamento padrão
        
        var errors = 0;
        var contacts = {};

        ui.fields.forEach(function(field) {
            if(field.value.length == 0){
                field.classList.add("error");
                errors++;
            } else{
                field.classList.remove("error"); 
                contacts[field.id] = field.value;
            }
         });

         console.log(errors, contacts);
         if(errors > 0){
             document.querySelector(".error").focus();
         } else{
             addContact(contacts);
             cleanField();
         }

    };

    var genericError = function(err){
        console.log('ERROR:', err.message);
    }

    var addContact = function(contacts){
        var config = {
            method:"POST",
            body:JSON.stringify(contacts),
            headers: new Headers({ "Content-type": "application/json" })
        };

            fetch(endpoint, config)
            .then(getContacts)
            .catch(genericError);
              
    };

    var getContacts = function(){
        var config = {
            method:"GET",
            headers: new Headers({ "Content-type": "application/json" })
        };

       fetch(`${endpoint}?_sort=id&_order=desc`, config) //Promise 1
            .then(function(resp){ return resp.json();  }) //resolved 1 - Promise 2
            .then(getContactSuccess) //resolved 2
            .catch(genericError)//rejected 2
            .catch(genericError);//rejected 1
    }; 

    var getContactSuccess = function(contacts){
        ui.tableContacts.innerHTML =   contacts.map(function(contact){
           return `<tr>
                <td>${contact.id}</td>
                <td>${contact.name}</td>
                <td>${contact.email}</td>
                <td>${contact.phone}</td>
                <td>
                    <a href="#" data-action="edit" data-id="${contact.id}">Editar</a> | 
                    <a href="#" data-action="delete" data-id="${contact.id}">Excluir</a>
                </td>
            </tr>`;
        }).join("")

        
    }

    var cleanField = function(){
        ui.fields.forEach(function(){
            field.value ="";
        });
    };

    var editContact = function(){
        debugger;
    };

    var removeContact = function(){
        var config = {
            method:"DELETE",
            headers: new Headers({ "Content-type": "application/json" })
        };

            fetch(`${endpoint}/${arguments[0]}`, config)
            .then(getContacts)
            .catch(genericError);
              
    };

    var handlerContact = function(e){
        e.preventDefault();

        //destructuring - ES6
        var {action,id} = e.target.dataset;
        console.log(action,id);

        if(e.target.dataset.action == "edit"){
            editContact(e.target.dataset.id);
        }

        if(e.target.dataset.action == "delete"){
            removeContact(e.target.dataset.id);
        }
       
    };

    var init = function(){
        //Mapping Event
        ui.buttonAdd.onclick = validateFields;
        ui.tableContacts.onclick = handlerContact;
    }();
})();