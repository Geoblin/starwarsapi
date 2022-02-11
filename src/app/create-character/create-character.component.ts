import { Component, OnInit } from '@angular/core';
import { StarWarsService } from '../star-wars.service'; //Importera startwars APIt

@Component({
  selector: 'app-create-character',
  templateUrl: './create-character.component.html',
  styleUrls: ['./create-character.component.css']
})
export class CreateCharacterComponent implements OnInit {
  availableSides = [ //Propen för att välja light, dark eller all. 
    {display:'None', value:''},
    {display:'Light', value:'light'},
    {display:'Dark', value:'dark'}]

  swService: StarWarsService; //Skapar en property av vår swService

  constructor(swService: StarWarsService) { //Tar in starwarsservice och pushar upp våra chars till character arrayen
    this.swService = swService; //Denna swService som är injektad från starwarsService är vår prop swService.
   }

  ngOnInit(): void {
  }
  //När man trycker på add charater i formet så använder vi denna funktionen. Vi tar emot submitted forms value och callar på vår addcharater och passar det värdet (namn+sida) från formet
  onSubmit(submittedForm: any) {
    if (submittedForm.invalid) { 
      //Denna ifen stoppar så vi inte kan passa in tomma fält.
      return;
    }
    this.swService.addCharacter(submittedForm.value.name, submittedForm.value.side)

    console.log(submittedForm.value)
  }

}
