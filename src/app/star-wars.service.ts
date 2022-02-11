//Service är en typescript class som vi kan använda i andra komponenter.
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { LogService } from "./log.service";
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators'

@Injectable() //Gör det möjligt för Angular att lägga till en annan service in i denna service.
export class StarWarsService {

  //vår characters array.
  private characters = [
    { name: 'Luke Skywalker', side: '' },
    { name: 'Leia Organa', side: '' },
    { name: 'R2-D2', side: ''}
  ];
  private logService: LogService;
  Changedcharacters = new Subject<void>(); //objekt från rxjs.
  http: HttpClient;

/*Vi använder oss igen utav Dependency injection för att kalla på vår LogService i vår StarWarsService.
Vi injectar också HttpClientModule som ger os möjligheten att skicka och posta request till en api.*/
  constructor(logService:LogService, http: HttpClient ) {
    this.logService = logService;
    this.http = http;
  }

/*Async kod, genomförs bara när svaret finns där. 
Skickar en request till Starwars APIet med get metoden och subar till den med response metod som consolloggar det vi får tillbaka.*/
fetchCharacters() {
  this.http.get('https://swapi.dev/api/people')
  .pipe(map //Gör om datan så den blir användbar
    ((response : any) => {
    const data = response //Sparar datan i const data
    const extractedChars = data.results //Hittar extractedChars på data.results på api sidan
    const chars = extractedChars.map //Chars är resultatet av extractedChars.map()
      ((char:any) => { return {name: char.name, side: ''} //Returnera namn och side som en tom sträng
      })
      return chars})) //Vi returnerar chars som alltså är vår extraherade data för alla karaktärer med endast namn och sida.
    .subscribe(
      (data: any) => {
        console.log(data)
        this.characters = data
        this.Changedcharacters.next(); //kallar på next metoden på Changedcharacters för att visa applikationen att karaktärerna har ändrats så att sidan visar vår hämtade lista när datan laddas in.
      })

  }

  //Denna funktion använder chosenList för att hämta de karaktärerna som är på den lista vi valt. All, light eller dark.
  getCharacters(chosenList: any) {
    if (chosenList === 'all') {
      return this.characters.slice();
    }
    return this.characters.filter((char) => {
      return char.side === chosenList;
    })
  }

  /*Via clicklistener i vår item komponent trycker användaren på light eller dark knappen under en karaktär och vi kallar på funktionen onAssign
  som i sin tur kallar på onSideChosen i vår StarWarsService och vår character blir positionerad på den sidan vi har valt, light eller dark.
  */
  onSideChosen(charInfo:any) {
    const pos = this.characters.findIndex((char) => {
      return char.name === charInfo.name;
    })

    this.characters[pos].side = charInfo.side;
    this.Changedcharacters.next(); //vi emittar nästa värde med next
    this.logService.writeLog('Changed side of ' + charInfo.name + ', new side: ' + charInfo.side) //Loggar ut karaktärens namn och vald sida.
  }

  //Metod för lägga till karaktärer från form till lista av karaktärer.
  addCharacter(name:string, side:string) {
    const pos = this.characters.findIndex((char) => { //Söker efter positionen av karaktären i characters array via findIndex metod och ser så att char name matchar namnet av vår skapade karaktär
      return char.name === name;
    })
    if (pos !== -1) { //Om pos är inte likamed -1, returnerar vi värdet om det redan finns.
      return;
    }
    const newChar = {name: name, side: side}; //Vi skapar en variabel för ett nytt karaktärs objekt som har ett namn och en sida
    this.characters.push(newChar); //Vi pushar upp vår nya karaktär till vår characters array.
  }
}