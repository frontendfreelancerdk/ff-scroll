import { inject, TestBed } from '@angular/core/testing';
import { ScrollService } from './scroll.service';


describe('Service: LanguagesService', () => {
  let service;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [ScrollService]
  }));

  beforeEach(inject([ScrollService], s => {
    service = s;
  }));

  it('should return item', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    const item = service.subscribe(element, {});
    expect(item.state).toBeLessThanOrEqual(2);
  });
});
