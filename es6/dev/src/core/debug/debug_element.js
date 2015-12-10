import { isPresent } from 'angular2/src/facade/lang';
import { unimplemented } from 'angular2/src/facade/exceptions';
import { ViewType } from 'angular2/src/core/linker/view';
import { internalView } from 'angular2/src/core/linker/view_ref';
/**
 * A DebugElement contains information from the Angular compiler about an
 * element and provides access to the corresponding ElementInjector and
 * underlying DOM Element, as well as a way to query for children.
 *
 * A DebugElement can be obtained from a {@link ComponentFixture} or
 * {@link RootTestComponent}.
 */
export class DebugElement {
    get componentInstance() { return unimplemented(); }
    ;
    get nativeElement() { return unimplemented(); }
    ;
    get elementRef() { return unimplemented(); }
    ;
    /**
     * Get child DebugElements from within the Light DOM.
     *
     * @return {DebugElement[]}
     */
    get children() { return unimplemented(); }
    ;
    /**
     * Get the root DebugElement children of a component. Returns an empty
     * list if the current DebugElement is not a component root.
     *
     * @return {DebugElement[]}
     */
    get componentViewChildren() { return unimplemented(); }
    ;
    /**
     * Return the first descendant TestElement matching the given predicate
     * and scope.
     *
     * @param {Function: boolean} predicate
     * @param {Scope} scope
     *
     * @return {DebugElement}
     */
    query(predicate, scope = Scope.all) {
        var results = this.queryAll(predicate, scope);
        return results.length > 0 ? results[0] : null;
    }
    /**
     * Return descendant TestElememts matching the given predicate
     * and scope.
     *
     * @param {Function: boolean} predicate
     * @param {Scope} scope
     *
     * @return {DebugElement[]}
     */
    queryAll(predicate, scope = Scope.all) {
        var elementsInScope = scope(this);
        return elementsInScope.filter(predicate);
    }
}
export class DebugElement_ extends DebugElement {
    constructor(_parentView, _boundElementIndex) {
        super();
        this._parentView = _parentView;
        this._boundElementIndex = _boundElementIndex;
        this._elementInjector = this._parentView.elementInjectors[this._boundElementIndex];
    }
    get componentInstance() {
        if (!isPresent(this._elementInjector)) {
            return null;
        }
        return this._elementInjector.getComponent();
    }
    get nativeElement() { return this.elementRef.nativeElement; }
    get elementRef() { return this._parentView.elementRefs[this._boundElementIndex]; }
    getDirectiveInstance(directiveIndex) {
        return this._elementInjector.getDirectiveAtIndex(directiveIndex);
    }
    get children() {
        return this._getChildElements(this._parentView, this._boundElementIndex);
    }
    get componentViewChildren() {
        var shadowView = this._parentView.getNestedView(this._boundElementIndex);
        if (!isPresent(shadowView) || shadowView.proto.type !== ViewType.COMPONENT) {
            // The current element is not a component.
            return [];
        }
        return this._getChildElements(shadowView, null);
    }
    triggerEventHandler(eventName, eventObj) {
        this._parentView.triggerEventHandlers(eventName, eventObj, this._boundElementIndex);
    }
    hasDirective(type) {
        if (!isPresent(this._elementInjector)) {
            return false;
        }
        return this._elementInjector.hasDirective(type);
    }
    inject(type) {
        if (!isPresent(this._elementInjector)) {
            return null;
        }
        return this._elementInjector.get(type);
    }
    getLocal(name) { return this._parentView.locals.get(name); }
    /** @internal */
    _getChildElements(view, parentBoundElementIndex) {
        var els = [];
        var parentElementBinder = null;
        if (isPresent(parentBoundElementIndex)) {
            parentElementBinder = view.proto.elementBinders[parentBoundElementIndex - view.elementOffset];
        }
        for (var i = 0; i < view.proto.elementBinders.length; ++i) {
            var binder = view.proto.elementBinders[i];
            if (binder.parent == parentElementBinder) {
                els.push(new DebugElement_(view, view.elementOffset + i));
                var views = view.viewContainers[view.elementOffset + i];
                if (isPresent(views)) {
                    views.views.forEach((nextView) => { els = els.concat(this._getChildElements(nextView, null)); });
                }
            }
        }
        return els;
    }
}
/**
 * Returns a {@link DebugElement} for an {@link ElementRef}.
 *
 * @param {ElementRef}: elementRef
 * @return {DebugElement}
 */
export function inspectElement(elementRef) {
    return new DebugElement_(internalView(elementRef.parentView), elementRef.boundElementIndex);
}
export function asNativeElements(arr) {
    return arr.map((debugEl) => debugEl.nativeElement);
}
export class Scope {
    static all(debugElement) {
        var scope = [];
        scope.push(debugElement);
        debugElement.children.forEach(child => scope = scope.concat(Scope.all(child)));
        debugElement.componentViewChildren.forEach(child => scope = scope.concat(Scope.all(child)));
        return scope;
    }
    static light(debugElement) {
        var scope = [];
        debugElement.children.forEach(child => {
            scope.push(child);
            scope = scope.concat(Scope.light(child));
        });
        return scope;
    }
    static view(debugElement) {
        var scope = [];
        debugElement.componentViewChildren.forEach(child => {
            scope.push(child);
            scope = scope.concat(Scope.light(child));
        });
        return scope;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWdfZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFuZ3VsYXIyL3NyYy9jb3JlL2RlYnVnL2RlYnVnX2VsZW1lbnQudHMiXSwibmFtZXMiOlsiRGVidWdFbGVtZW50IiwiRGVidWdFbGVtZW50LmNvbXBvbmVudEluc3RhbmNlIiwiRGVidWdFbGVtZW50Lm5hdGl2ZUVsZW1lbnQiLCJEZWJ1Z0VsZW1lbnQuZWxlbWVudFJlZiIsIkRlYnVnRWxlbWVudC5jaGlsZHJlbiIsIkRlYnVnRWxlbWVudC5jb21wb25lbnRWaWV3Q2hpbGRyZW4iLCJEZWJ1Z0VsZW1lbnQucXVlcnkiLCJEZWJ1Z0VsZW1lbnQucXVlcnlBbGwiLCJEZWJ1Z0VsZW1lbnRfIiwiRGVidWdFbGVtZW50Xy5jb25zdHJ1Y3RvciIsIkRlYnVnRWxlbWVudF8uY29tcG9uZW50SW5zdGFuY2UiLCJEZWJ1Z0VsZW1lbnRfLm5hdGl2ZUVsZW1lbnQiLCJEZWJ1Z0VsZW1lbnRfLmVsZW1lbnRSZWYiLCJEZWJ1Z0VsZW1lbnRfLmdldERpcmVjdGl2ZUluc3RhbmNlIiwiRGVidWdFbGVtZW50Xy5jaGlsZHJlbiIsIkRlYnVnRWxlbWVudF8uY29tcG9uZW50Vmlld0NoaWxkcmVuIiwiRGVidWdFbGVtZW50Xy50cmlnZ2VyRXZlbnRIYW5kbGVyIiwiRGVidWdFbGVtZW50Xy5oYXNEaXJlY3RpdmUiLCJEZWJ1Z0VsZW1lbnRfLmluamVjdCIsIkRlYnVnRWxlbWVudF8uZ2V0TG9jYWwiLCJEZWJ1Z0VsZW1lbnRfLl9nZXRDaGlsZEVsZW1lbnRzIiwiaW5zcGVjdEVsZW1lbnQiLCJhc05hdGl2ZUVsZW1lbnRzIiwiU2NvcGUiLCJTY29wZS5hbGwiLCJTY29wZS5saWdodCIsIlNjb3BlLnZpZXciXSwibWFwcGluZ3MiOiJPQUFPLEVBQU8sU0FBUyxFQUFVLE1BQU0sMEJBQTBCO09BRTFELEVBQUMsYUFBYSxFQUFDLE1BQU0sZ0NBQWdDO09BRXJELEVBQVUsUUFBUSxFQUFDLE1BQU0sK0JB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QUFFQSxDQUFDQTtRQUNmQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUV6QkEsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsSUFBSUEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFL0VBLFlBQVlBLENBQUNBLHFCQUFxQkEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsSUFBSUEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFFNUZBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2ZBLENBQUNBO0lBQ0RELE9BQU9BLEtBQUtBLENBQUNBLFlBQTBCQTtRQUNyQ0UsSUFBSUEsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7UUFDZkEsWUFBWUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0E7WUFDakNBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ2xCQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUMzQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDSEEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7SUFDZkEsQ0FBQ0E7SUFFREYsT0FBT0EsSUFBSUEsQ0FBQ0EsWUFBMEJBO1FBQ3BDRyxJQUFJQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtRQUVmQSxZQUFZQSxDQUFDQSxxQkFBcUJBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBO1lBQzlDQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsQkEsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDM0NBLENBQUNBLENBQUNBLENBQUNBO1FBQ0hBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO0lBQ2ZBLENBQUNBO0FBQ0hILENBQUNBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R5cGUsIGlzUHJlc2VudCwgaXNCbGFua30gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9sYW5nJztcbmltcG9ydCB7TGlzdFdyYXBwZXIsIE1hcFdyYXBwZXIsIFByZWRpY2F0ZX0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9jb2xsZWN0aW9uJztcbmltcG9ydCB7dW5pbXBsZW1lbnRlZH0gZnJvbSAnYW5ndWxhcjIvc3JjL2ZhY2FkZS9leGNlcHRpb25zJztcbmltcG9ydCB7RWxlbWVudEluamVjdG9yfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvZWxlbWVudF9pbmplY3Rvcic7XG5pbXBvcnQge0FwcFZpZXcsIFZpZXdUeXBlfSBmcm9tICdhbmd1bGFyMi9zcmMvY29yZS9saW5rZXIvdmlldyc7XG5pbXBvcnQge2ludGVybmFsVmlld30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbGlua2VyL3ZpZXdfcmVmJztcbmltcG9ydCB7RWxlbWVudFJlZiwgRWxlbWVudFJlZl99IGZyb20gJ2FuZ3VsYXIyL3NyYy9jb3JlL2xpbmtlci9lbGVtZW50X3JlZic7XG5cbi8qKlxuICogQSBEZWJ1Z0VsZW1lbnQgY29udGFpbnMgaW5mb3JtYXRpb24gZnJvbSB0aGUgQW5ndWxhciBjb21waWxlciBhYm91dCBhblxuICogZWxlbWVudCBhbmQgcHJvdmlkZXMgYWNjZXNzIHRvIHRoZSBjb3JyZXNwb25kaW5nIEVsZW1lbnRJbmplY3RvciBhbmRcbiAqIHVuZGVybHlpbmcgRE9NIEVsZW1lbnQsIGFzIHdlbGwgYXMgYSB3YXkgdG8gcXVlcnkgZm9yIGNoaWxkcmVuLlxuICpcbiAqIEEgRGVidWdFbGVtZW50IGNhbiBiZSBvYnRhaW5lZCBmcm9tIGEge0BsaW5rIENvbXBvbmVudEZpeHR1cmV9IG9yXG4gKiB7QGxpbmsgUm9vdFRlc3RDb21wb25lbnR9LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGVidWdFbGVtZW50IHtcbiAgZ2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgZ2V0IG5hdGl2ZUVsZW1lbnQoKTogYW55IHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHVuaW1wbGVtZW50ZWQoKTsgfTtcblxuICBhYnN0cmFjdCBnZXREaXJlY3RpdmVJbnN0YW5jZShkaXJlY3RpdmVJbmRleDogbnVtYmVyKTogYW55O1xuXG4gIC8qKlxuICAgKiBHZXQgY2hpbGQgRGVidWdFbGVtZW50cyBmcm9tIHdpdGhpbiB0aGUgTGlnaHQgRE9NLlxuICAgKlxuICAgKiBAcmV0dXJuIHtEZWJ1Z0VsZW1lbnRbXX1cbiAgICovXG4gIGdldCBjaGlsZHJlbigpOiBEZWJ1Z0VsZW1lbnRbXSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgcm9vdCBEZWJ1Z0VsZW1lbnQgY2hpbGRyZW4gb2YgYSBjb21wb25lbnQuIFJldHVybnMgYW4gZW1wdHlcbiAgICogbGlzdCBpZiB0aGUgY3VycmVudCBEZWJ1Z0VsZW1lbnQgaXMgbm90IGEgY29tcG9uZW50IHJvb3QuXG4gICAqXG4gICAqIEByZXR1cm4ge0RlYnVnRWxlbWVudFtdfVxuICAgKi9cbiAgZ2V0IGNvbXBvbmVudFZpZXdDaGlsZHJlbigpOiBEZWJ1Z0VsZW1lbnRbXSB7IHJldHVybiB1bmltcGxlbWVudGVkKCk7IH07XG5cbiAgYWJzdHJhY3QgdHJpZ2dlckV2ZW50SGFuZGxlcihldmVudE5hbWU6IHN0cmluZywgZXZlbnRPYmo6IEV2ZW50KTogdm9pZDtcblxuICBhYnN0cmFjdCBoYXNEaXJlY3RpdmUodHlwZTogVHlwZSk6IGJvb2xlYW47XG5cbiAgYWJzdHJhY3QgaW5qZWN0KHR5cGU6IFR5cGUpOiBhbnk7XG5cbiAgYWJzdHJhY3QgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogYW55O1xuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGZpcnN0IGRlc2NlbmRhbnQgVGVzdEVsZW1lbnQgbWF0Y2hpbmcgdGhlIGdpdmVuIHByZWRpY2F0ZVxuICAgKiBhbmQgc2NvcGUuXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb246IGJvb2xlYW59IHByZWRpY2F0ZVxuICAgKiBAcGFyYW0ge1Njb3BlfSBzY29wZVxuICAgKlxuICAgKiBAcmV0dXJuIHtEZWJ1Z0VsZW1lbnR9XG4gICAqL1xuICBxdWVyeShwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+LCBzY29wZTogRnVuY3Rpb24gPSBTY29wZS5hbGwpOiBEZWJ1Z0VsZW1lbnQge1xuICAgIHZhciByZXN1bHRzID0gdGhpcy5xdWVyeUFsbChwcmVkaWNhdGUsIHNjb3BlKTtcbiAgICByZXR1cm4gcmVzdWx0cy5sZW5ndGggPiAwID8gcmVzdWx0c1swXSA6IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIGRlc2NlbmRhbnQgVGVzdEVsZW1lbXRzIG1hdGNoaW5nIHRoZSBnaXZlbiBwcmVkaWNhdGVcbiAgICogYW5kIHNjb3BlLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9uOiBib29sZWFufSBwcmVkaWNhdGVcbiAgICogQHBhcmFtIHtTY29wZX0gc2NvcGVcbiAgICpcbiAgICogQHJldHVybiB7RGVidWdFbGVtZW50W119XG4gICAqL1xuICBxdWVyeUFsbChwcmVkaWNhdGU6IFByZWRpY2F0ZTxEZWJ1Z0VsZW1lbnQ+LCBzY29wZTogRnVuY3Rpb24gPSBTY29wZS5hbGwpOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIGVsZW1lbnRzSW5TY29wZTogYW55W10gPSBzY29wZSh0aGlzKTtcblxuICAgIHJldHVybiBlbGVtZW50c0luU2NvcGUuZmlsdGVyKHByZWRpY2F0ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGNsYXNzIERlYnVnRWxlbWVudF8gZXh0ZW5kcyBEZWJ1Z0VsZW1lbnQge1xuICAvKiogQGludGVybmFsICovXG4gIF9lbGVtZW50SW5qZWN0b3I6IEVsZW1lbnRJbmplY3RvcjtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIF9wYXJlbnRWaWV3OiBBcHBWaWV3LCBwcml2YXRlIF9ib3VuZEVsZW1lbnRJbmRleDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9lbGVtZW50SW5qZWN0b3IgPSB0aGlzLl9wYXJlbnRWaWV3LmVsZW1lbnRJbmplY3RvcnNbdGhpcy5fYm91bmRFbGVtZW50SW5kZXhdO1xuICB9XG5cbiAgZ2V0IGNvbXBvbmVudEluc3RhbmNlKCk6IGFueSB7XG4gICAgaWYgKCFpc1ByZXNlbnQodGhpcy5fZWxlbWVudEluamVjdG9yKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50SW5qZWN0b3IuZ2V0Q29tcG9uZW50KCk7XG4gIH1cblxuICBnZXQgbmF0aXZlRWxlbWVudCgpOiBhbnkgeyByZXR1cm4gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7IH1cblxuICBnZXQgZWxlbWVudFJlZigpOiBFbGVtZW50UmVmIHsgcmV0dXJuIHRoaXMuX3BhcmVudFZpZXcuZWxlbWVudFJlZnNbdGhpcy5fYm91bmRFbGVtZW50SW5kZXhdOyB9XG5cbiAgZ2V0RGlyZWN0aXZlSW5zdGFuY2UoZGlyZWN0aXZlSW5kZXg6IG51bWJlcik6IGFueSB7XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRJbmplY3Rvci5nZXREaXJlY3RpdmVBdEluZGV4KGRpcmVjdGl2ZUluZGV4KTtcbiAgfVxuXG4gIGdldCBjaGlsZHJlbigpOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldENoaWxkRWxlbWVudHModGhpcy5fcGFyZW50VmlldywgdGhpcy5fYm91bmRFbGVtZW50SW5kZXgpO1xuICB9XG5cbiAgZ2V0IGNvbXBvbmVudFZpZXdDaGlsZHJlbigpOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIHNoYWRvd1ZpZXcgPSB0aGlzLl9wYXJlbnRWaWV3LmdldE5lc3RlZFZpZXcodGhpcy5fYm91bmRFbGVtZW50SW5kZXgpO1xuXG4gICAgaWYgKCFpc1ByZXNlbnQoc2hhZG93VmlldykgfHwgc2hhZG93Vmlldy5wcm90by50eXBlICE9PSBWaWV3VHlwZS5DT01QT05FTlQpIHtcbiAgICAgIC8vIFRoZSBjdXJyZW50IGVsZW1lbnQgaXMgbm90IGEgY29tcG9uZW50LlxuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9nZXRDaGlsZEVsZW1lbnRzKHNoYWRvd1ZpZXcsIG51bGwpO1xuICB9XG5cbiAgdHJpZ2dlckV2ZW50SGFuZGxlcihldmVudE5hbWU6IHN0cmluZywgZXZlbnRPYmo6IEV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5fcGFyZW50Vmlldy50cmlnZ2VyRXZlbnRIYW5kbGVycyhldmVudE5hbWUsIGV2ZW50T2JqLCB0aGlzLl9ib3VuZEVsZW1lbnRJbmRleCk7XG4gIH1cblxuICBoYXNEaXJlY3RpdmUodHlwZTogVHlwZSk6IGJvb2xlYW4ge1xuICAgIGlmICghaXNQcmVzZW50KHRoaXMuX2VsZW1lbnRJbmplY3RvcikpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2VsZW1lbnRJbmplY3Rvci5oYXNEaXJlY3RpdmUodHlwZSk7XG4gIH1cblxuICBpbmplY3QodHlwZTogVHlwZSk6IGFueSB7XG4gICAgaWYgKCFpc1ByZXNlbnQodGhpcy5fZWxlbWVudEluamVjdG9yKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9lbGVtZW50SW5qZWN0b3IuZ2V0KHR5cGUpO1xuICB9XG5cbiAgZ2V0TG9jYWwobmFtZTogc3RyaW5nKTogYW55IHsgcmV0dXJuIHRoaXMuX3BhcmVudFZpZXcubG9jYWxzLmdldChuYW1lKTsgfVxuXG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2dldENoaWxkRWxlbWVudHModmlldzogQXBwVmlldywgcGFyZW50Qm91bmRFbGVtZW50SW5kZXg6IG51bWJlcik6IERlYnVnRWxlbWVudFtdIHtcbiAgICB2YXIgZWxzID0gW107XG4gICAgdmFyIHBhcmVudEVsZW1lbnRCaW5kZXIgPSBudWxsO1xuICAgIGlmIChpc1ByZXNlbnQocGFyZW50Qm91bmRFbGVtZW50SW5kZXgpKSB7XG4gICAgICBwYXJlbnRFbGVtZW50QmluZGVyID0gdmlldy5wcm90by5lbGVtZW50QmluZGVyc1twYXJlbnRCb3VuZEVsZW1lbnRJbmRleCAtIHZpZXcuZWxlbWVudE9mZnNldF07XG4gICAgfVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5wcm90by5lbGVtZW50QmluZGVycy5sZW5ndGg7ICsraSkge1xuICAgICAgdmFyIGJpbmRlciA9IHZpZXcucHJvdG8uZWxlbWVudEJpbmRlcnNbaV07XG4gICAgICBpZiAoYmluZGVyLnBhcmVudCA9PSBwYXJlbnRFbGVtZW50QmluZGVyKSB7XG4gICAgICAgIGVscy5wdXNoKG5ldyBEZWJ1Z0VsZW1lbnRfKHZpZXcsIHZpZXcuZWxlbWVudE9mZnNldCArIGkpKTtcblxuICAgICAgICB2YXIgdmlld3MgPSB2aWV3LnZpZXdDb250YWluZXJzW3ZpZXcuZWxlbWVudE9mZnNldCArIGldO1xuICAgICAgICBpZiAoaXNQcmVzZW50KHZpZXdzKSkge1xuICAgICAgICAgIHZpZXdzLnZpZXdzLmZvckVhY2goXG4gICAgICAgICAgICAgIChuZXh0VmlldykgPT4geyBlbHMgPSBlbHMuY29uY2F0KHRoaXMuX2dldENoaWxkRWxlbWVudHMobmV4dFZpZXcsIG51bGwpKTsgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGVscztcbiAgfVxufVxuXG4vKipcbiAqIFJldHVybnMgYSB7QGxpbmsgRGVidWdFbGVtZW50fSBmb3IgYW4ge0BsaW5rIEVsZW1lbnRSZWZ9LlxuICpcbiAqIEBwYXJhbSB7RWxlbWVudFJlZn06IGVsZW1lbnRSZWZcbiAqIEByZXR1cm4ge0RlYnVnRWxlbWVudH1cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGluc3BlY3RFbGVtZW50KGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpOiBEZWJ1Z0VsZW1lbnQge1xuICByZXR1cm4gbmV3IERlYnVnRWxlbWVudF8oaW50ZXJuYWxWaWV3KCg8RWxlbWVudFJlZl8+ZWxlbWVudFJlZikucGFyZW50VmlldyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAoPEVsZW1lbnRSZWZfPmVsZW1lbnRSZWYpLmJvdW5kRWxlbWVudEluZGV4KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFzTmF0aXZlRWxlbWVudHMoYXJyOiBEZWJ1Z0VsZW1lbnRbXSk6IGFueVtdIHtcbiAgcmV0dXJuIGFyci5tYXAoKGRlYnVnRWwpID0+IGRlYnVnRWwubmF0aXZlRWxlbWVudCk7XG59XG5cbmV4cG9ydCBjbGFzcyBTY29wZSB7XG4gIHN0YXRpYyBhbGwoZGVidWdFbGVtZW50OiBEZWJ1Z0VsZW1lbnQpOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIHNjb3BlID0gW107XG4gICAgc2NvcGUucHVzaChkZWJ1Z0VsZW1lbnQpO1xuXG4gICAgZGVidWdFbGVtZW50LmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4gc2NvcGUgPSBzY29wZS5jb25jYXQoU2NvcGUuYWxsKGNoaWxkKSkpO1xuXG4gICAgZGVidWdFbGVtZW50LmNvbXBvbmVudFZpZXdDaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHNjb3BlID0gc2NvcGUuY29uY2F0KFNjb3BlLmFsbChjaGlsZCkpKTtcblxuICAgIHJldHVybiBzY29wZTtcbiAgfVxuICBzdGF0aWMgbGlnaHQoZGVidWdFbGVtZW50OiBEZWJ1Z0VsZW1lbnQpOiBEZWJ1Z0VsZW1lbnRbXSB7XG4gICAgdmFyIHNjb3BlID0gW107XG4gICAgZGVidWdFbGVtZW50LmNoaWxkcmVuLmZvckVhY2goY2hpbGQgPT4ge1xuICAgICAgc2NvcGUucHVzaChjaGlsZCk7XG4gICAgICBzY29wZSA9IHNjb3BlLmNvbmNhdChTY29wZS5saWdodChjaGlsZCkpO1xuICAgIH0pO1xuICAgIHJldHVybiBzY29wZTtcbiAgfVxuXG4gIHN0YXRpYyB2aWV3KGRlYnVnRWxlbWVudDogRGVidWdFbGVtZW50KTogRGVidWdFbGVtZW50W10ge1xuICAgIHZhciBzY29wZSA9IFtdO1xuXG4gICAgZGVidWdFbGVtZW50LmNvbXBvbmVudFZpZXdDaGlsZHJlbi5mb3JFYWNoKGNoaWxkID0+IHtcbiAgICAgIHNjb3BlLnB1c2goY2hpbGQpO1xuICAgICAgc2NvcGUgPSBzY29wZS5jb25jYXQoU2NvcGUubGlnaHQoY2hpbGQpKTtcbiAgICB9KTtcbiAgICByZXR1cm4gc2NvcGU7XG4gIH1cbn1cbiJdfQ==