<script lang="ts">
  let SteamAPIKey = "06FE5D22465119B0EF975E85622AB87F";

  let playerIDList = [];
  let playerData = [];
  let playerGamesLists = [];

  let gameDisplay = [];
  let trueMultiIDs = [504230, 367520];
  let needsMods = [504230, 367520];

  let addComparePlayerInput: string = "";
  async function getPlayer(debugID?: string) {
    let URLCheck = addComparePlayerInput.indexOf("id");
    if (!playerIDList) {
      playerIDList = [];
    }
    if (debugID) {
      playerIDList.push(debugID);
    } else if (URLCheck > -1) {
      const response = await fetch(
        "https://corsproxy.io/?" +
          encodeURIComponent(
            "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=" +
              SteamAPIKey +
              "&vanityurl=" +
              addComparePlayerInput.substring(
                URLCheck + 3,
                addComparePlayerInput.lastIndexOf("/")
              )
          )
      );
      let id = await response.json();
      id = id.response.steamid;
      playerIDList.push(id);
    } else {
      let id = addComparePlayerInput.substring(
        0,
        addComparePlayerInput.lastIndexOf("/")
      );
      id = id.substring(id.lastIndexOf("/") + 1);
      playerIDList.push(id);
    }
    addGames(playerIDList[playerIDList.length - 1]);
    addPlayerData(playerIDList[playerIDList.length - 1]);
  }

  async function getGames(steamid: string) {
    const response = await fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent(
          "http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=" +
            SteamAPIKey +
            "&steamid=" +
            steamid +
            "&include_appinfo=true&format=json"
        )
    );
    let gamelist = await response.json();
    gamelist = gamelist.response;

    return gamelist;
  }

  function addGames(steamid: string) {
    getGames(steamid).then((obj) => {
      playerGamesLists.push(obj);
    });
    console.log(playerGamesLists);
  }

  async function addPlayerData(steamid: string) {
    const playerSummaries = await fetch(
      "https://corsproxy.io/?" +
        encodeURIComponent(
          "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=" +
            SteamAPIKey +
            "&steamids=" +
            steamid
        )
    );
    let jsonPlayerSummaries = await playerSummaries.json();
    jsonPlayerSummaries = jsonPlayerSummaries.response.players;
    for (let i = 0; i < jsonPlayerSummaries.length; i++) {
      const element = jsonPlayerSummaries[i];
      playerData.push(element);
    }
    playerData = playerData;
    console.log(playerData);
  }

  function crossAllLibraries() {
    gameDisplay = [];
    let smallestLibrary = Number.MAX_SAFE_INTEGER;
    let SLIndex = 0;

    if (playerGamesLists.length > 1) {
      for (let i = 0; i < playerGamesLists.length; i++) {
        const element = playerGamesLists[i].game_count;
        if (element < smallestLibrary) {
          smallestLibrary = element;
          SLIndex = i;
        }
      }

      for (let i = 0; i < playerGamesLists[SLIndex].games.length; i++) {
        const game = playerGamesLists[SLIndex].games[i].appid;
        let boolList = [];
        for (let j = 0; j < playerGamesLists.length; j++) {
          deDuper: {
            if (j == SLIndex) {
              break deDuper;
            }
            for (let k = 0; k < playerGamesLists[j].games.length; k++) {
              const check = playerGamesLists[j].games[k].appid;
              if (game == check) {
                boolList.push(game == check);
                break deDuper;
              }
            }
          }
        }
        if (boolList.length == playerGamesLists.length - 1) {
          gameDisplay.push(playerGamesLists[SLIndex].games[i]);
        }
      }
    } else {
      gameDisplay = playerGamesLists[0].games;
    }

    console.log(gameDisplay);

    gameDisplay = gameDisplay;
  }

  function removePlayer(steamid: string) {
    let index = playerIDList.indexOf(steamid);

    playerGamesLists.splice(index, 1);
    playerData.splice(index, 1);
    playerIDList.splice(index, 1);

    playerData = playerData;
  }
</script>

<svelte:head>
  <title>TableTalk</title>
</svelte:head>

<div class="flex flex-col w-full mt-2 gap-2">
  <div class="flex flex-row text-center mx-24">
    Welcome to the Multi-Person Steam Library Comparison Tool! Have you ever had
    a group of friends, but just weren't sure what games that you ALL had that
    you could play that way no one felt left out? This is made to solve that! In
    order to begin, copy there Steam Profile URL and put it in the provided text
    box, then hit add. Do this for every person you want to compare, and the
    games list below is all the games you all own.
  </div>
  <div class="flex flex-row gap-2 justify-center items-center">
    <div>Player To Add</div>
    <input
      type="text"
      placeholder="Read Instructions"
      class="input input-bordered w-full max-w-xs"
      bind:value={addComparePlayerInput}
    />
    <button
      class="btn btn-primary"
      on:click={() => {
        getPlayer();
      }}>Add Player</button
    >
    <button
      class="btn btn-accent"
      on:click={() => {
        crossAllLibraries();
      }}>Check Libraries</button
    >
  </div>
  <div class="flex flex-row justify-between gap-2">
    <div class="grid grid-cols-4 gap-4 w-3/4 mx-4 mb-4">
      {#each gameDisplay as game}
        <div
          class="flex flex-col gap-2 items-center bg-base-200 rounded-3xl items-center justify-center"
        >
          <img
            src={"https://steamcdn-a.akamaihd.net/steam/apps/" +
              game.appid +
              "/library_600x900_2x.jpg"}
            alt={game.appid}
            class="w-1/2 mt-2 rounded-3xl"
          />
          <div class="flex flex-row">
            <div class="flex flex-col w-full mx-2 mb-2">
              <div
                class="flex flex-row text-center items-center justify-center"
              >
                {#if trueMultiIDs.includes(game.appid)}
                  <div class="tooltip" data-tip="Multiplayer Recommended">
                    ⭐
                  </div>
                {/if}
                {#if needsMods.includes(game.appid)}
                  <div class="tooltip" data-tip="Requires Mods for Multiplayer">
                    🔧
                  </div>
                {/if}
                {game.name}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
    <div class="flex flex-col gap-4 mr-4 w-1/4">
      {#each playerData as player}
        <div
          class="flex flex-row rounded-3xl items-center gap-2 bg-base-200 h-24 w-full"
        >
          <img
            src={player.avatarfull}
            alt={player.steamid}
            class="h-1/2 ml-4"
          />
          <div class="flex flex-col mr-4">
            <div>
              {player.personaname}
            </div>
          </div>
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <svg
            version="1.1"
            id="Capa_1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 460.775 460.775"
            xml:space="preserve"
            class="fill-white h-4 opacity-70 transistion-all duration-200 hover:fill-red-500 hover:opacity-100"
            on:click={() => {
              removePlayer(player.steamid);
            }}
            ><g id="SVGRepo_bgCarrier" stroke-width="0" /><g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            /><g id="SVGRepo_iconCarrier">
              <path
                d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55 c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55 c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505 c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55 l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719 c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
              />
            </g></svg
          >
        </div>
      {/each}
    </div>
  </div>
</div>
