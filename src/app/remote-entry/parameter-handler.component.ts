import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HostDataService, HostData } from '../services/host-data.service';

@Component({
  selector: 'app-parameter-handler',
  template: `
    <div class="parameter-handler">
      <h2>🔧 MFE 参数处理器</h2>
      <p>正在处理来自 Host 的参数...</p>
      
      <div *ngIf="hostData && getObjectKeys(hostData).length > 0" class="params-display">
        <h3>📨 接收到的参数:</h3>
        <ul>
          <li *ngFor="let param of getParameterEntries()">
            <strong>{{param.key}}:</strong> {{param.value}}
          </li>
        </ul>
      </div>
      
      <div class="actions">
        <button (click)="goToHome()" class="btn">前往主页</button>
        <button (click)="goToTerms()" class="btn">前往条款页面</button>
        <button (click)="goToTest()" class="btn">前往测试页面</button>
      </div>
    </div>
  `,
  styles: [`
    .parameter-handler {
      padding: 20px;
      text-align: center;
      max-width: 600px;
      margin: 0 auto;
    }
    
    .params-display {
      margin: 20px 0;
      padding: 15px;
      background: #f5f5f5;
      border-radius: 5px;
    }
    
    ul {
      text-align: left;
      display: inline-block;
    }
    
    .actions {
      margin-top: 20px;
    }
    
    .btn {
      margin: 5px;
      padding: 10px 15px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 3px;
      cursor: pointer;
    }
    
    .btn:hover {
      background: #0056b3;
    }
  `]
})
export class ParameterHandlerComponent implements OnInit {
  hostData: HostData = {};

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private hostDataService: HostDataService
  ) {}

  /**
   * 获取对象键数组（用于模板）
   */
  getObjectKeys(obj: any): string[] {
    return Object.keys(obj || {});
  }

  ngOnInit() {
    // 合并所有可能的参数源
    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(queryParams => {
        // 合并路由参数和查询参数
        const allParams: HostData = {
          ...params,
          ...queryParams
        };
        
        // 保存到服务
        this.hostDataService.updateHostData(allParams);
        this.hostData = allParams;
        
        console.log('📨 Parameter Handler 接收到参数:', allParams);
      });
    });

    // 监听服务中的数据变化
    this.hostDataService.hostData$.subscribe(data => {
      this.hostData = data;
    });
  }

  getParameterEntries() {
    return Object.entries(this.hostData).map(([key, value]) => ({ 
      key, 
      value: typeof value === 'object' ? JSON.stringify(value) : value 
    }));
  }

  goToHome() {
    this.router.navigate(['/'], { 
      queryParams: this.hostData,
      replaceUrl: true 
    });
  }

  goToTerms() {
    this.router.navigate(['/terms-conditions'], { 
      queryParams: this.hostData 
    });
  }

  goToTest() {
    this.router.navigate(['/test-host-data'], { 
      queryParams: this.hostData 
    });
  }
}