import { Component, OnInit } from '@angular/core';
import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, switchMap } from 'rxjs';


@Component({
  selector: 'app-heroe-page',
  templateUrl: './heroe-page.component.html',
  styles: [
  ]
})
export class HeroePageComponent{

  public hero?: Hero;

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    ) {}

    ngOnInit(): void {
      this.activatedRoute.params
        .pipe(
          switchMap( ({ id }) => this.heroesService.getHeroById( id )),
        )
        .subscribe( hero => {

          if ( !hero ) return this.router.navigate([ '/heroes/list' ]);

          this.hero = hero;
          return;
        })
    }

  goBack(): void{
    this.router.navigateByUrl('heroes/list')
  }

}
