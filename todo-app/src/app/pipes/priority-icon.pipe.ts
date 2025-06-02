import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'priorityIcon'
})
export class PriorityIconPipe implements PipeTransform{
    transform(value: any) {
        switch(value){
            case 1:
                return 'equals';
            case 2:
                return 'arrow-up';
            case 3:
                return 'arrows-up-to-line';
            default:
                return 'minus';
        }
    }

}