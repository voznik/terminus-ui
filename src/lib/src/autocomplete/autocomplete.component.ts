import {
  Component,
  Input,
  Output,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
  ViewChild,
  ElementRef,
  isDevMode,
} from '@angular/core';
import {
  FormControl,
  ValidationErrors,
} from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatAutocomplete,
} from '@angular/material';
import { debounceTime } from 'rxjs/operators/debounceTime';
import { distinctUntilChanged } from 'rxjs/operators/distinctUntilChanged';
import { filter } from 'rxjs/operators/filter';
import {
  coerceArray,
  coerceNumberProperty,
} from '@terminus/ngx-tools/coercion';
import {
  isFunction,
  arrayContainsObject,
} from '@terminus/ngx-tools';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { TsStyleThemeTypes } from './../utilities/types/style-theme.types';
import {
  TsAutocompleteFormatterFn,
  TsAutocompleteComparatorFn,
} from './../utilities/types/autocomplete.types';


/**
 * The autocomplete UI Component
 *
 * #### QA CSS CLASSES
 * - `qa-autocomplete`: The primary container
 * - `qa-autocomplete-input`: The input element
 * - `qa-autocomplete-spinner`: The progress indicator
 * - `qa-autocomplete-chip`: An individual selection 'chip'
 * - `qa-autocomplete-options`: The container for the list of options
 * - `qa-autocomplete-option`: An individual option from the list
 * - `qa-autocomplete-hint`: The input hint
 * - `qa-autocomplete-validation-messages`: The container for validation messages
 *
 * @example
 * <ts-autocomplete
 *              debounceDelay="300"
 *              displayWith="(v) => v.name"
 *              hint="Begin typing to search.."
 *              label="Select options:"
 *              multiple="(v) => v.id"
 *              name="product selections"
 *              options="[{}, {}, ...]"
 *              selectionsControl="myForm.get('myControl')"
 *              [showProgress]="inProgress"
 *              theme="primary"
 *              initialSelections="[{}]"
 *              (optionSelected)="mySelected($event)"
 *              (optionRemoved)="myRemoved($event)"
 *              (selection)="mySelection($event)"
 *              (query)="myQuery($event)"
 * ></ts-autocomplete>
 *
 * <example-url>https://goo.gl/ieUPaG</example-url>
 */
@Component({
  selector: 'ts-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
  exportAs: 'tsAutocomplete',
  host: {
    class: 'ts-autocomplete',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class TsAutocompleteComponent<OptionType = {[name: string]: any}> implements AfterViewInit, OnDestroy {
  /**
   * Store the debounce delay
   */
  private _debounceDelay: number = 200;

  /**
   * Management of the query string
   */
  public querySubject: BehaviorSubject<string> = new BehaviorSubject('');

  /**
   * Store the search query
   */
  public searchQuery: string;

  /**
   * Define if the chips/selections should be selectable
   */
  public selectableChips: boolean = false;

  /**
   * Store the selected options
   */
  public selectedOptions: OptionType[] = [];

  /**
   * Store the formatter function for the UI display
   */
  private uiFormatFn: (value: OptionType) => string;

  /**
   * Store the query subscription for unsubscribing during cleanup
   */
  private querySubscription: Subscription;

  /**
   * Provide access to the input element
   */
  @ViewChild('autocomplete')
  public autocomplete: MatAutocomplete;

  /**
   * Provide access to the input element
   */
  @ViewChild('autocompleteTrigger')
  set autocompleteTrigger(value: MatAutocompleteTrigger) {
    this.trigger = value;
  }
  get autocompleteTrigger(): MatAutocompleteTrigger {
    return this.trigger;
  }
  private trigger: MatAutocompleteTrigger;

  /**
   * Provide direct access to the input
   */
  @ViewChild('input')
  public input: ElementRef;

  /**
   * Define a debounce delay for the query
   */
  @Input()
  public set debounceDelay(value: number) {
    if (!value && value !== 0) {
      return;
    }

    this._debounceDelay = coerceNumberProperty(value);
  }
  public get debounceDelay(): number {
    return this._debounceDelay;
  }

  /**
   * A function to output the UI text from the selected item
   *
   * When undefined the full selection object will be used as the display value
   */
  @Input()
  public set displayWith(value: TsAutocompleteFormatterFn) {
    if (!value) {
      return;
    }

    if (isFunction(value)) {
      this.uiFormatFn = value;
    } else {
      // istanbul ignore else
      if (isDevMode()) {
        throw Error(`TsAutocompleteComponent: 'displayWith' must be passed a function.`)
      }
    }
  }
  public get displayWith(): TsAutocompleteFormatterFn {
    return this.uiFormatFn;
  }

  /**
   * Define a hint for the input
   */
  // FIXME: Fix potential overlap of hint and error messages
  @Input()
  public hint: string;

  /**
   * Define the placeholder/label
   */
  @Input()
  public label: string;

  /**
   * Define if multiple selections are allowed by passing in a comparator function
   */
  @Input()
  public set multiple(v: TsAutocompleteComparatorFn) {
    if (!v) {
      return;
    }

    if (isFunction(v)) {
      this.comparatorFn = v;
    } else {
      // istanbul ignore else
      if (isDevMode()) {
        throw Error(`TsAutocompleteComponent: 'multiple' must be passed a 'TsAutocompleteComparatorFn' function.`)
      }
    }
  }
  public get multiple(): TsAutocompleteComparatorFn {
    return this.comparatorFn;
  }
  private comparatorFn: TsAutocompleteComparatorFn;

  /**
   * Define the name attribute value
   */
  @Input()
  public name: string;

  /**
   * The list of options to display in the drop down
   */
  @Input()
  public options: OptionType[];

  /**
   * Define the form control to save selections to
   */
  @Input()
  public selectionsControl: FormControl;

  /**
   * Define if the progress spinner should be active
   */
  @Input()
  public showProgress: boolean = false;

  /**
   * Define the component theme
   */
  @Input()
  public theme: TsStyleThemeTypes = 'primary';

  /**
   * Define items that should be selected when the component loads
   */
  @Input()
  public set initialSelections(selections: OptionType[]) {
    // istanbul ignore else
    if (selections) {
      // Seed the array
      this.selectedOptions = coerceArray(selections);

      // istanbul ignore else
      if (this.selectionsControl && this.selectionsControl.setValue) {
        // Seed the formControl
        this.selectionsControl.setValue(this.selectedOptions);
      }
    }
  };

  /**
   * Emit the selected chip
   */
  @Output()
  public optionSelected: EventEmitter<OptionType> = new EventEmitter();

  /**
   * Emit the removed chip
   */
  @Output()
  public optionRemoved: EventEmitter<OptionType> = new EventEmitter();

  /**
   * Emit the current selection
   */
  @Output()
  public selection: EventEmitter<OptionType[]> = new EventEmitter();

  /**
   * Emit the query string
   */
  @Output()
  public query: EventEmitter<string> = new EventEmitter();


  /**
   * Subscribe to the querySubject and pass values to the query emitter
   *
   * FIXME: When an option is selected, the full selected value is piped through this stream
   * somehow. Have not figured out why. Best guess is it's something due to the `matAutocomplete`
   * directive. For now, we are filtering out anything that is not a string.
   */
  public ngAfterViewInit(): void {
    // Take a stream of query changes
    this.querySubscription = this.querySubject.pipe(
      filter((v) => (typeof v === 'string')),
      // Debounce the query changes
      debounceTime(this.debounceDelay),
      // Only allow a query through if it is different from the previous query
      distinctUntilChanged(),
    ).subscribe((query: string) => {
      this.query.next(query);
    });
  }


  /**
   * Unsubscribe
   */
  public ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }


  /**
   * Select an option
   *
   * @param event - The selection event from the underlying MatAutocomplete
   * @param input - The input that triggered the event
   */
  public selectOption(event: MatAutocompleteSelectedEvent, input?: ElementRef): void {
    // The selected option
    const selection: OptionType = event.option.value;

    // Stop the flow if the selection already exists in the array
    if (arrayContainsObject(selection, this.selectedOptions, this.comparatorFn)) {
      // Set an error on the control to let the user know they chose a duplicate option
      // istanbul ignore else
      if (this.selectionsControl) {
        this.setDuplicateError(this.selectionsControl, selection, this.uiFormatFn);
      }

      return;
    }


    // Add to the displayed selection chips
    this.selectedOptions.push(selection);

    // If supporting multiple selections, reset the input text value
    if (this.multiple) {
      this.resetSearch();
    }

    // Update the form control
    // istanbul ignore else
    if (this.selectionsControl && this.selectionsControl.setValue) {
      this.selectionsControl.setValue(this.selectedOptions);
    }

    // Let consumers know about the changes
    this.optionSelected.emit(event.option.value);
    this.selection.emit(this.selectedOptions);
  }


  /**
   * Deselect an option
   *
   * @param option - The option to deselect
   */
  public deselectOption(option: OptionType): void {
    // Find the key of the selection in the selectedOptions array
    const index = this.selectedOptions.indexOf(option);

    // If not found
    if (index < 0) {
      return;
    }

    // Remove the selection from the selectedOptions array
    this.selectedOptions.splice(index, 1);

    // Update the form control
    // istanbul ignore else
    if (this.selectionsControl && this.selectionsControl.setValue) {
      this.selectionsControl.setValue(this.selectedOptions);
    }

    // Let consumers know about the changes
    this.optionRemoved.emit(option);
    this.selection.emit(this.selectedOptions);
  }


  /**
   * Use the user defined `displayWith` function to show the correct UI text if it was set.
   * Otherwise, display the selected value.
   *
   * @param option - The option
   * @return The string value for the UI or the entire option object
   */
  public displayOption(option: OptionType): string | OptionType {
    return (this.uiFormatFn) ? this.uiFormatFn(option) : option;
  }


  /**
   * Close the dropdown and reset the query when the user leaves the input
   *
   * @param event - The keyboard or mouse event
   */
  public handleBlur(event: KeyboardEvent | MouseEvent): void {
    // NOTE(B$): cannot use dot syntax here since 'relatedTarget' doesn't exist on a KeyboardEvent
    const eventValue = (event && event['relatedTarget']) ? event['relatedTarget'] : null;

    if (eventValue && eventValue.nodeName) {
      // If the blur event comes from the user clicking an option, `event.relatedTarget.nodeName`
      // will be `MAT-OPTION`.
      if (eventValue.nodeName !== 'MAT-OPTION') {
        this.resetSearch();
      }
    } else {
      // If no eventValue exists, this was a blur event triggered by the Escape key
      this.resetSearch();
    }

    // Since the user never interacts directly with the 'selectionsControl' formControl, we need to
    // manually mark it as 'touched' to trigger validation messages.
    // istanbul ignore else
    if (this.selectionsControl && this.selectionsControl.markAsTouched) {
      this.selectionsControl.markAsTouched();
    }
  }


  /**
   * Reset the autocomplete input and close the panel
   */
  private resetSearch(): void {
    // Close the autocomplete planel
    // istanbul ignore else
    if (this.trigger.panelOpen) {
      this.trigger.closePanel();
    }
    // Clear the query model
    this.searchQuery = '';
    // Clear the search query stream
    this.querySubject.next('');
    // Clear the query input
    this.input.nativeElement.value = '';
  }


  /**
   * Set an error on the form control for a duplicate selection
   *
   * @param control - The form control
   * @param selection - The selected option
   * @param formatter - The UI formatter function
   */
  private setDuplicateError(control: FormControl, selection: OptionType, formatter?: TsAutocompleteFormatterFn): void {
    const invalidResponse: ValidationErrors = {
      notUnique: {
        valid: false,
        actual: formatter ? formatter(selection) : selection,
      },
    };

    control.setErrors(invalidResponse);
  }

}
