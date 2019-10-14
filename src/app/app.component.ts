import { Component, OnInit } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'ChatApp';


  /**
   * Instance d'un Observable WebSocket
   */
  private _socket: WebSocketSubject<any>;

  /**
   * Instance d'un groupe de contrôles
   */
  public sendForm: FormGroup;

  /**
   * Tableau pour recevoir les messages du serveur
   */
  public serverMessages: any[];

  constructor(private _formBuilder: FormBuilder) {
    console.log('Connexion client WebSocket');

    this._socket = new WebSocketSubject('ws://127.0.0.1:8999');

    // Initialise le tableau des messages
    this.serverMessages = [];

    // Juste pour tester la communication sortante
    this._authenticate();

    // Souscription aux messages provenant du serveur
    this._socket
        .subscribe((message) => {
          console.log('Le serveur envoie : ' + JSON.stringify(message));
          this.serverMessages.push(message);
        },
        (err) => console.error('Erreur levée : ' + JSON.stringify(err)),
        () => console.warn('Completed!')
      );
  }

  public ngOnInit() {
    this.sendForm = this._formBuilder.group({
        message: [
          '',
          [Validators.required]
        ]
      }
    );
  }

  public send() {
    const _message: any = {
      user: 'JL',
      message: this.sendForm.controls.message.value
    };
    this._socket.next(_message);
    this.sendForm.reset();
  }

  private _authenticate(): void {
    console.log('Idenfitication du client');
    const _auth: any = {
      user: 'JL',
      message: 'JL vient de se connecter',
      connect: true
    };
    this._socket.next(JSON.stringify(_auth));
  }
}
