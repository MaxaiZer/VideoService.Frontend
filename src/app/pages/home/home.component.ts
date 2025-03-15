import { Component } from '@angular/core';
import { VideoSearchComponent } from "../../components/video-search/video-search.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [VideoSearchComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
