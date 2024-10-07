let resetAllBtn = document.querySelector('.reset_all')
resetAllBtn.addEventListener('click',resetAllTodos)
let todosContainer = document.querySelector('.todos')
let subjectInput = document.getElementById('subject_input')
let dateInput = document.getElementById('date_input')
let addBtn = document.getElementById('add_btn')
addBtn.addEventListener('click',addBtnAction)

let subjectCount = localStorage.getItem('count');
if(subjectCount == null)
{
  localStorage.setItem('count',0)
}

function dateDetector()
{
  let addDate = new Date().toISOString().slice(0, 10);
  return addDate;
}

let tempStorage = []
exportToTempStorage();
existingSubjectsMake();

function existingSubjectsMake()
{
  for(let i=0 ; i<tempStorage.length ; i++)
  {
    subjectCreator(tempStorage[i].id ,tempStorage[i].subject ,tempStorage[i].targetDate ,
     tempStorage[i].addDate , tempStorage[i].isCompleted)
  }
}

function exportToTempStorage()
{
  let testStorage = []
  for(let i=0 ; i<localStorage.length + subjectCount ; i++)
  {
    testStorage.push(JSON.parse(localStorage.getItem('subject'+i)))
    if(testStorage[i] != null)
    {
      tempStorage.push(testStorage[i])
    }
  }
}

function importToLocalStorage()
{
  subjectCount = localStorage.getItem('count');
  let count = tempStorage.length-1;
  localStorage.setItem('subject'+subjectCount , JSON.stringify({id:subjectCount , subject:tempStorage[count].subject ,
     addDate:tempStorage[count].addDate , targetDate:tempStorage[count]. targetDate
     , isCompleted:tempStorage[count].isCompleted}))
}

function addBtnAction()
{
  let addDate = dateDetector()
  if(subjectInput.value != '' && dateInput.value != '')
  {
    tempStorage.push({id: subjectCount , subject: subjectInput.value, addDate:addDate , targetDate:dateInput.value , isCompleted:false})
    importToLocalStorage()
    subjectCreator(subjectCount,subjectInput.value , dateInput.value , addDate);
    subjectInput.value='';
    dateInput.value='';
    subjectCount++;
    localStorage.setItem('count',subjectCount)
  }
}

function subjectCreator(id,subject,targetDate,addDate,isCompleted)
{
  let ul = document.createElement('ul');
  ul.classList.add('todo_item','flex_row_box');
  ul.dataset.id = id;
  ul.dataset.isCompleted = isCompleted;

  let li1 = document.createElement('li');
  li1.textContent = subject;

  let li2 = document.createElement('li');
  li2.textContent = addDate;

  let li3 = document.createElement('li');
  li3.textContent = targetDate;

  let li4 = document.createElement('li');
  li4.classList.add('buttons_container','flex_row_box');

  let button1 = document.createElement('button');
  button1.textContent = 'Completed';
  button1.addEventListener('click', subjectCompleteAction);

  let button2 = document.createElement('button');
  button2.textContent = 'Delete';
  button2.addEventListener('click', subjectDeleteAction);

  li4.append(button1,button2);
  ul.append(li1,li2,li3,li4);
  todosContainer.append(ul);
}

function subjectCompleteAction(event)
{
  let subjectContainer = event.target.parentElement.parentElement;
  let todoId = Number(subjectContainer.dataset.id);
  subjectContainer.dataset.isCompleted = true;
  tempStorage.some(function(todo){
    if(todo.id == todoId)
    {
      todo.isCompleted = true;
      localStorage.setItem('subject'+todoId , JSON.stringify({id:todoId , subject:tempStorage[todoId].subject ,
        addDate:tempStorage[todoId].addDate , targetDate:tempStorage[todoId]. targetDate
        , isCompleted:tempStorage[todoId].isCompleted}))
    }
  })

}

function subjectDeleteAction(event)
{
  let subjectContainer = event.target.parentElement.parentElement;
  let todoId = Number(subjectContainer.dataset.id);
  // tempStorage.splice(todoId,1)
  localStorage.removeItem('subject'+todoId);
  subjectContainer.remove();

}


function resetAllTodos(){
  localStorage.clear();
  location.reload();
}