async function getBook(){
    try{
        const res = await axios.get('/books');
        const books = res.data;

        const list = document.getElementById('list');
        list.innerHTML = '';

        Object.keys(books).map(function (key){
            // 새로운 책 정보 내용을 담는 div객체 생성
            const bookDiv = document.createElement('div');
            bookDiv.className = "bookDiv";


            // 책이름, 학교명, 설명을 담는 span을 각각 생성
            const spanName = document.createElement('span');
            spanName.className = "bookSpan";
            const spanSchool = document.createElement('span');
            spanSchool.className = "bookSpan";
            const spanContent = document.createElement('span');
            spanContent.className = "bookSpan";

            spanName.textContent = '책이름: ' + books[key].name;
            spanSchool.textContent = '학교명: ' + books[key].school;
            spanContent.textContent = '과목명: ' + books[key].contents;

            // edit button 생성
            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.className = "bookBtnEdit";
 
            // 수정 버튼 이벤트 리스너
            edit.addEventListener('click', async () => {
                const name = prompt('새로운 책 이름을 입력하세요');
                const school = prompt('새로운 학교명을 입력하세요');
                const contents = prompt('새로운 과목명을 입력하세요');

                // 제출시 정보가 모두 들어가지 않았을때 -> 경고 메세지 출력
                if(!name || !school || !contents){
                    return alert('수정할 정보를 입력해주세요!');
                }
                try{
                    //정보가 모두 들어가면 -> put
                    await axios.put('/book/' + key, {name, school, contents});
                    getBook();
                }catch(err){
                    console.error(err);
                }
                
            });

            // 삭제 button 생성
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.className = "bookBtnDelete";


            // 삭제 버튼 이벤트 리스너
            remove.addEventListener('click', async() => {
                try{
                    await axios.delete('/book/' + key);
                    alert('선택하신 책 정보가 삭제되었습니다.');
                    getBook();
                }catch(err){
                    console.error(err);
                }
            });

            //div에 child로 span, button 추가
            bookDiv.appendChild(spanName);
            bookDiv.appendChild(document.createElement("br"));
            bookDiv.appendChild(spanSchool);
            bookDiv.appendChild(document.createElement("br"));
            bookDiv.appendChild(spanContent);
            bookDiv.appendChild(document.createElement("br"));
            bookDiv.appendChild(edit);
            bookDiv.appendChild(remove);

            //bookDiv를 list(div)에 추가
            list.appendChild(bookDiv);
            console.log(res.data);
        });
    }catch (err) {
        console.error(err);
    }
}

window.onload = getBook;

// upload에서 폼 제출시 실행 (새로운 책 정보 등록)
document.getElementById('form').addEventListener('submit', async(e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const school = e.target.school.value;
    const contents = e.target.contents.value;
    if(!name || !school || !contents){
        return alert('내용을 모두 입력하세요');
    }
    try{
        
        await axios.post('/book', { name, school, contents });
        getBook();
        } catch(err){
        console.error(err);
        }

    e.target.name.value = '';
    e.target.school.value = '';
    e.target.contents.value = '';

    alert('책 정보가 등록되었습니다.');

});