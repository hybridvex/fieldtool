const fieldWidth = 134.9;

let mX = 0,
mY = 0,
oX = 0,
oY = 0,
mode = 'origin';
let points = [];


window.onload = () => {
    const base_img = document.getElementById("base_img");
    const cv = document.getElementById("cv");
    const ctx = cv.getContext('2d');
    const coords = document.getElementById('coords');

    const pointNameInput = e => {
        const id = parseInt(e.target.getAttribute('id'));
        points[id].name = e.target.value;
    }
    const pointColInput = e => {
        const id = parseInt(e.target.getAttribute('id'));
        points[id].col = e.target.value;
        // e.target.focus();
        renderCanvas();
    }
    function renderCanvas() {
        // render base img
        ctx.clearRect(0, 0, 500, 500);
        ctx.drawImage(base_img, 0, 0, dWidth = 500, dHeight = 500);
        // render cursor
        ctx.strokeStyle = {
            'normal': '#133d16',
            'origin': '#ff0000'
        }[mode];
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(mX - 10, mY);
        ctx.lineTo(mX + 10, mY);
        ctx.moveTo(mX, mY - 10);
        ctx.lineTo(mX, mY + 10);
        ctx.stroke();
        // render coords
        const aX = mX - oX,
            aY = -(mY - oY);
        const iX = aX / 500 * fieldWidth,
            iY = aY / 500 * fieldWidth;
        if (mode == 'normal') {
            coords.innerText = `${iX.toFixed(2)}, ${iY.toFixed(2)}`;
            // render origin
            ctx.fillStyle = '#ff0000';
            ctx.beginPath();
            ctx.arc(oX, oY, 5, 0, 2 * Math.PI);
            ctx.fill();
        } else if (mode == 'origin') {
            coords.innerText = 'Setting origin';
        }
        document.getElementById('points').innerHTML = '';
        points.forEach((p, i) => {
            // render point
            ctx.fillStyle = p.col;
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2 * Math.PI);
            ctx.fill();
            // show options
            const elem = document.createElement('div');
            elem.innerHTML = `
            <span>
            <input type="text" value="${p.name}" class="pointName" id="${i}"/>
            ${((p.x - oX)/500*fieldWidth).toFixed(2)}, ${((oY - p.y)/500*fieldWidth).toFixed(2)}
            <input type="color" value="${p.col}" class="pointCol" id="${i}"/>
            <button type="button" class="pointRemove" id="${i}">x</button>
            <button type="button" class="pointCopy" id="${i}">Copy</button>
            </span>
            `;
            elem.getElementsByClassName('pointName')[0].oninput = pointNameInput;
            elem.getElementsByClassName('pointCol')[0].onchange = pointColInput;
            elem.getElementsByClassName('pointRemove')[0].onclick = e => {
                points.splice(parseInt(e.target.getAttribute('id')), 1);
                renderCanvas();
            };
            elem.getElementsByClassName('pointCopy')[0].onclick = e => {
                const p = points[parseInt(e.target.getAttribute('id'))];
                navigator.clipboard.writeText(
                    `{${((p.x - oX)/500*fieldWidth).toFixed(2)}_in, ${((oY - p.y)/500*fieldWidth).toFixed(2)}_in}`
                    );
                renderCanvas();
            };
            document.getElementById('points').appendChild(elem);
        });
    }
    renderCanvas();
    cv.onmousemove = e => {
        mX = e.offsetX;
        mY = e.offsetY;
        renderCanvas();
    }
    cv.onmousedown = e => {
        if (mode == 'origin') {
            mode = 'normal';
            oX = mX;
            oY = mY;
            document.getElementById('origin').classList.remove('invis');
            document.getElementById('oX').value = (mX / 500 * fieldWidth).toFixed(2);
            document.getElementById('oY').value = ((500 - mY) / 500 * fieldWidth).toFixed(2);
            renderCanvas();
        } else if (mode == 'normal') {
            points.push({x: mX, y: mY, col: '#f5f542', name: ''});
            renderCanvas();
        }
    }
    document.getElementById('pickOrigin').onclick = () => {
        mode = 'origin';
        oX = 0;
        oY = 0;
        document.getElementById('origin').classList.add('invis');
        renderCanvas();
    }
    document.getElementById('oX').oninput = () => {
        oX = parseFloat(document.getElementById('oX').value)/fieldWidth*500;
        renderCanvas();
    }
    document.getElementById('oY').oninput = () => {
        oY = 500 - parseFloat(document.getElementById('oY').value)/fieldWidth*500;
        renderCanvas();
    }
}