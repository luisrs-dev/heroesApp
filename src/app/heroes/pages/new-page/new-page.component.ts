import { ConfirmDialogComponent } from './../../component/confirm-dialog/confirm-dialog.component';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: [
  ]
})
export class NewPageComponent implements OnInit {

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(
        // switchMap( params)
        switchMap(({ id }) => this.heroesService.getHeroById(id)),
      ).subscribe(hero => {
        if (!hero) return this.router.navigateByUrl('/')
        this.heroForm.reset(hero);
        return;
      })
  }

  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    { id: 'DC Comics', desc: 'DC-Comics' },
    { id: 'Marvel Comics', desc: 'Marvel - Comics' }
  ];

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  onSubmit(): void {
    if (this.heroForm.invalid) return;

    if (this.currentHero.id) {
      this.heroesService.updateHero(this.currentHero)
        .subscribe(hero => {
          this.showSnackBar(`${hero.superhero} updated!`)
          // TODO mostrar snackbar
        });
      return;
    }

    this.heroesService.addHero(this.currentHero)
      .subscribe(hero => {
        this.router.navigate(['/heroes/edit', hero.id])
        this.showSnackBar(`${hero.superhero} created!`)

        // TODO  snackbar y navegar a /heroes/edit/hero.id
      })

    console.log({
      formIsValid: this.heroForm.valid,
      value: this.heroForm.getRawValue()
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw Error('Hero id required');

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });


    dialogRef.afterClosed()
      .pipe(
        // Filter se utiliza para permitr o no avanzar a partir del valor
        filter(result => true),
        switchMap(() => this.heroesService.deleteHeroById(this.currentHero.id)),
        filter((wasDeleted: boolean) => wasDeleted),
        tap(wasDeleted => console.log({ wasDeleted }))
      )
      // No interesa el resultado, a partir de los filtros anteriores es positivo
      .subscribe(() => {
        this.router.navigate(['/heroes'])
      })

      // Todo este cópigo es igual a bloque de arriba
    // dialogRef.afterClosed().subscribe(result => {
    //   console.log('The dialog was closed');
    //   console.log({ result });

    //   if( !result) return;
    //   console.log('delete');

    //   this.heroesService.deleteHeroById( this.currentHero.id)
    //     .subscribe( wasDeleted => {
    //       this.router.navigate(['/heroes'])
    //     })
    // });


  }

  showSnackBar(message: string): void {
    this.snackBar.open(message, 'done', {
      duration: 2500
    })

  }

}
