import { expect } from 'chai';
import { suite, test } from 'mocha-typescript';
import { ControlNameResolverService } from '../../src/services'
import { ContentList } from '../../src/index';

@suite('ControlNameResolverService Tests')
export class ControlNameResolverTests {

    private ControlNameResolverService: ControlNameResolverService;

    before() {
        this.ControlNameResolverService = new ControlNameResolverService();
    }

    @test
    public 'ControlNameResolver should return Null if control is null'() {
        const name = this.ControlNameResolverService.getNameForControl(null as any);
        expect(name).to.be.eq(null);
    }

    @test
    public 'ControlNameResolver should return Null if control doesn\'t have a name'() {
        const name = this.ControlNameResolverService.getNameForControl({} as any);
        expect(name).to.be.eq(null);
    }

    @test
    public 'ControlNameResolver should return Null if control name is empty'() {
        const name = this.ControlNameResolverService.getNameForControl({ name: '' } as any);
        expect(name).to.be.eq(null);
    }

    @test
    public async 'ControlNameResolver should return correct module name if found by object reference'() {
        const name = this.ControlNameResolverService.getNameForControl(ContentList, (callback) => {
            callback('example-module-path/Module1', {Module: true});
            callback('example-module-path/ContentList', {ContentList: ContentList});
        });
        expect(name).to.be.eq('example-module-path/ContentList');
    }

    @test
    public async 'ControlNameResolver should return correct module name if found by object name (fallback)'() {
        const name = this.ControlNameResolverService.getNameForControl({name: 'ContentList'}, (callback) => {
            callback('example-module-path/Module1', {Module: true});
            callback('example-module-path/ContentList', {ContentList: ContentList});
        });
        expect(name).to.be.eq('example-module-path/ContentList');
    }
}

