document.addEventListener("DOMContentLoaded", () => {
  const boardEl = document.getElementById("board");
  const statusEl = document.getElementById("status");
  const winnerListEl = document.getElementById("winnerList");
  const scoreXEl = document.getElementById("scoreX");
  const scoreOEl = document.getElementById("scoreO");
  const roundNumEl = document.getElementById("roundNum");
  const resetBtn = document.getElementById("resetBtn");

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  let boardState = Array(9).fill(null);
  let currentPlayer = "X";
  let isGameOver = false;
  let score = { X: 0, O: 0 };
  let round = 1;
  let winnersRecord = [];

  function createBoard(){
    boardEl.innerHTML = "";
    for(let i=0; i<9; i++){
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.index = i;
      cell.addEventListener("click", handleCellClick);
      boardEl.appendChild(cell);
    }
  }

  function handleCellClick(e){
    if(isGameOver) return;

    const idx = e.target.dataset.index;
    if(boardState[idx]) return;

    boardState[idx] = currentPlayer;
    e.target.textContent = currentPlayer;
    e.target.classList.add("taken");

    const winner = checkWinner();
    if(winner){
      isGameOver = true;
      let name = "";
      while(!name){
        name = prompt(`第 ${round} 局 玩家 ${winner} 獲勝！請輸入您的名字：`);
        if(name) name = name.trim();
        if(!name) alert("名字不能空白！");
      }

      winnersRecord.push({ round, player: winner, name });
      updateWinnerList();

      score[winner]++;
      updateScoreboard();

      if(score[winner] >= 3){
        statusEl.textContent = `🏆 總冠軍是 ${name} （${winner}）！遊戲結束！`;
        resetBtn.style.display = "inline-block";
      } else {
        statusEl.textContent = `第 ${round} 局結束，玩家 ${winner} 獲勝！準備下一局...`;
        round++;
        roundNumEl.textContent = round;
        setTimeout(resetBoard, 1600);
      }
    } else if(checkDraw()){
      isGameOver = true;

      winnersRecord.push({ round, player: "平局", name: "-" });
      updateWinnerList();

      statusEl.textContent = `第 ${round} 局平手！換手繼續...`;
      round++;
      roundNumEl.textContent = round;

      // 換手
      currentPlayer = currentPlayer === "X" ? "O" : "X";

      setTimeout(resetBoard, 1600);
    } else {
      // 換手
      currentPlayer = currentPlayer === "X" ? "O" : "X";
      statusEl.textContent = `玩家 ${currentPlayer} 輪流下棋 - 第 ${round} 局`;
    }
  }

  function checkWinner(){
    for(const combo of WIN_COMBOS){
      const [a,b,c] = combo;
      if(boardState[a] && boardState[a] === boardState[b] && boardState[b] === boardState[c]){
        return boardState[a];
      }
    }
    return null;
  }

  function checkDraw(){
    return boardState.every(cell => cell !== null);
  }

  function updateWinnerList(){
    winnerListEl.innerHTML = "";
    winnersRecord.forEach(rec => {
      if(rec.player === "平局"){
        winnerListEl.innerHTML += `<li>第 ${rec.round} 局：平局</li>`;
      } else {
        winnerListEl.innerHTML += `<li>第 ${rec.round} 局：玩家 ${rec.player}（${rec.name}） 勝</li>`;
      }
    });
  }

  function updateScoreboard(){
    scoreXEl.textContent = score.X;
    scoreOEl.textContent = score.O;
  }

  function resetBoard(){
    boardState = Array(9).fill(null);
    isGameOver = false;
    currentPlayer = "X";
    createBoard();
    statusEl.textContent = `玩家 ${currentPlayer} 輪流下棋 - 第 ${round} 局`;
  }

  resetBtn.addEventListener("click", () => {
    score = { X:0, O:0 };
    round = 1;
    winnersRecord = [];
    updateScoreboard();
    updateWinnerList();
    resetBoard();
    resetBtn.style.display = "none";
  });

  // 初始化
  createBoard();
  updateScoreboard();
  roundNumEl.textContent = round;
  statusEl.textContent = `玩家 ${currentPlayer} 輪流下棋 - 第 ${round} 局`;
});
