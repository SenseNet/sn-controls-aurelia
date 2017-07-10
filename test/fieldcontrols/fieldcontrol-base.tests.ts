import { ComponentTestBase } from '../component-test.base';
import { ContentTypes, ActionName, FieldSettings, Retrier } from 'sn-client-js';
import { FieldBaseControl } from '../../src/fieldcontrols';

export class FieldControlBaseTest<T extends FieldBaseControl<any, any>> extends ComponentTestBase<T> {

    constructor(private readonly fieldBaseControlType: {new(...args: any[]): T},
                private readonly customElementName: string) {
        super();
    }

    public async createFieldViewModel() {
        return await this.createAndGetViewModel(`<generic-view><${this.customElementName}></${this.customElementName}></generic-view>`, this.customElementName);
    }

}